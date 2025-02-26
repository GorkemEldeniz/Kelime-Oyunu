import { COOKIE_CONFIG } from "@/config/auth";
import { ACCESS_TOKEN_MAX_AGE } from "@/constants";
import { generateToken } from "@/services/auth/token-service";
import * as jose from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that don't require authentication
const authPaths = [
	"/sign-in",
	"/sign-up",
	"/forgot-password",
	"/reset-password",
];

// Protected paths for authenticated users
const protectedPaths = ["/standings", "/profile", "/game"];

// Cookie names
const ACCESS_TOKEN_NAME = "access_token";
const REFRESH_TOKEN_NAME = "refresh_token";

/**
 * Enhanced logger for auth middleware
 * @param message Log message
 * @param data Additional data to log
 * @param level Log level (info, warn, error)
 */
function authLog(
	message: string,
	data: Record<string, unknown> = {},
	level: "info" | "warn" | "error" = "info"
) {
	// Create a timestamp for the log
	const timestamp = new Date().toISOString();

	// Structure the log data
	const logData = {
		timestamp,
		message,
		level,
		context: "auth-middleware",
		...data,
	};

	// Use appropriate console method based on level
	if (level === "error") {
		console.error(JSON.stringify(logData));
	} else if (level === "warn") {
		console.warn(JSON.stringify(logData));
	} else {
		// In development, we can format logs for readability
		if (process.env.NODE_ENV === "development") {
			console.log(`[AUTH] ${message}`, data);
		} else {
			// In production, use structured JSON logs for better parsing
			console.log(JSON.stringify(logData));
		}
	}
}

/**
 * Verify JWT token and return the payload if valid
 * @param token The JWT token to verify
 * @param secret The secret to use for verification
 * @param requestId The request ID for logging
 * @param tokenType The type of token being verified (for logging)
 */
async function verifyToken(
	token: string,
	secret: string,
	requestId: string,
	tokenType: "access" | "refresh"
) {
	try {
		const { payload } = await jose.jwtVerify(
			token,
			new TextEncoder().encode(secret)
		);

		authLog(`${tokenType} token valid`, {
			requestId,
			tokenType,
			userId: typeof payload.userId === "number" ? payload.userId : undefined,
			exp: payload.exp,
		});

		return { valid: true, payload };
	} catch (error) {
		authLog(
			`${tokenType} token verification failed`,
			{
				requestId,
				tokenType,
				error: error instanceof Error ? error.message : String(error),
			},
			"error"
		);

		return { valid: false, payload: null, error };
	}
}

/**
 * Handle protected route access
 * First validate access token, if invalid try refresh token
 */
async function handleProtectedRoute(
	request: NextRequest,
	pathname: string,
	requestId: string
) {
	authLog("Processing protected route", { requestId, path: pathname });

	const redirectUrl = new URL("/sign-in", request.url);
	redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

	// Get tokens
	const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

	// No access token, check if refresh token exists
	if (!accessToken) {
		authLog("No access token found", { requestId, path: pathname }, "warn");

		// If no refresh token either, redirect to login
		if (!refreshToken) {
			authLog(
				"No refresh token found",
				{
					requestId,
					path: pathname,
					redirectTo: redirectUrl.toString(),
				},
				"warn"
			);

			return NextResponse.redirect(redirectUrl);
		}

		// Try using refresh token
		return handleTokenRefresh(
			request,
			refreshToken,
			pathname,
			requestId,
			redirectUrl
		);
	}

	// Validate access token
	authLog("Validating access token", { requestId, path: pathname });
	const { valid, payload } = await verifyToken(
		accessToken,
		process.env.JWT_ACCESS_SECRET || "",
		requestId,
		"access"
	);

	if (valid && payload && typeof payload.userId === "number") {
		// Access token is valid
		authLog("Access granted with valid access token", {
			requestId,
			path: pathname,
			userId: payload.userId,
		});

		return NextResponse.next();
	}

	// Access token invalid, try refresh token
	if (refreshToken) {
		authLog("Invalid access token, trying refresh token", {
			requestId,
			path: pathname,
		});

		return handleTokenRefresh(
			request,
			refreshToken,
			pathname,
			requestId,
			redirectUrl
		);
	}

	// No valid tokens, redirect to login
	authLog(
		"No valid tokens found",
		{
			requestId,
			path: pathname,
			redirectTo: redirectUrl.toString(),
		},
		"warn"
	);

	return NextResponse.redirect(redirectUrl);
}

/**
 * Handle token refresh logic
 */
async function handleTokenRefresh(
	request: NextRequest,
	refreshToken: string,
	pathname: string,
	requestId: string,
	redirectUrl: URL
) {
	// Validate refresh token
	const { valid, payload } = await verifyToken(
		refreshToken,
		process.env.JWT_REFRESH_SECRET || "",
		requestId,
		"refresh"
	);

	if (!valid || !payload || typeof payload.userId !== "number") {
		authLog(
			"Invalid refresh token",
			{
				requestId,
				path: pathname,
				redirectTo: redirectUrl.toString(),
			},
			"warn"
		);

		return NextResponse.redirect(redirectUrl);
	}

	// Generate new access token
	const userId = payload.userId as number;
	authLog("Generating new access token", {
		requestId,
		path: pathname,
		userId,
	});

	const newAccessToken = await generateToken(userId, "ACCESS");

	// Create response and set new access token cookie
	const response = NextResponse.next();
	response.cookies.set(ACCESS_TOKEN_NAME, newAccessToken, {
		...COOKIE_CONFIG,
		maxAge: ACCESS_TOKEN_MAX_AGE,
	});

	authLog("Token refresh successful", {
		requestId,
		path: pathname,
		userId,
		tokenRefreshed: true,
	});

	return response;
}

/**
 * Handle auth route access
 * Redirect authenticated users away from auth routes
 */
async function handleAuthRoute(
	request: NextRequest,
	accessToken: string,
	pathname: string,
	requestId: string
) {
	authLog("User with token accessing auth route", {
		requestId,
		path: pathname,
	});

	// Validate access token
	const { valid, payload } = await verifyToken(
		accessToken,
		process.env.JWT_ACCESS_SECRET || "",
		requestId,
		"access"
	);

	if (!valid || !payload) {
		// Token invalid, allow access to auth route
		authLog(
			"Invalid token on auth route",
			{
				requestId,
				path: pathname,
			},
			"warn"
		);

		return NextResponse.next();
	}

	// Token valid, redirect away from auth route
	authLog("Valid token on auth route, redirecting", {
		requestId,
		path: pathname,
		userId: typeof payload.userId === "number" ? payload.userId : undefined,
	});

	// Redirect to the original destination or home
	const redirectParam = request.nextUrl.searchParams.get("redirect");
	if (redirectParam) {
		authLog("Redirecting to original destination", {
			requestId,
			path: pathname,
			redirectTo: redirectParam,
		});

		return NextResponse.redirect(new URL(redirectParam, request.url));
	}

	// If no redirect param, go to home
	authLog("Redirecting to home", {
		requestId,
		path: pathname,
		redirectTo: "/",
	});

	return NextResponse.redirect(new URL("/", request.url));
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const requestId = crypto.randomUUID();

	authLog("Auth middleware started", {
		requestId,
		path: pathname,
		method: request.method,
		userAgent: request.headers.get("user-agent"),
	});

	// Determine route type
	const isProtectedRoute = protectedPaths.includes(pathname);
	const isAuthRoute = authPaths.includes(pathname);

	// Get tokens
	const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

	authLog("Token status check", {
		requestId,
		path: pathname,
		hasAccessToken: !!accessToken,
		hasRefreshToken: !!refreshToken,
		isProtectedRoute,
		isAuthRoute,
	});

	// Handle protected routes
	if (isProtectedRoute) {
		return handleProtectedRoute(request, pathname, requestId);
	}

	// Handle auth routes when user has access token
	if (isAuthRoute && accessToken) {
		return handleAuthRoute(request, accessToken, pathname, requestId);
	}

	// For all other routes, just continue
	authLog("No authentication required for this route", {
		requestId,
		path: pathname,
	});

	return NextResponse.next();
}

// match all paths except static files
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|/).*)"],
};
