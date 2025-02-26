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

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const requestId = crypto.randomUUID();

	authLog("Auth middleware started", {
		requestId,
		path: pathname,
		method: request.method,
		userAgent: request.headers.get("user-agent"),
	});

	const isProtectedRoute = protectedPaths.includes(pathname);
	const isAuthRoute = authPaths.includes(pathname);

	// Get tokens
	const hasAccessToken = request.cookies.has(ACCESS_TOKEN_NAME);
	const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_NAME);
	const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

	authLog("Token status check", {
		requestId,
		path: pathname,
		hasAccessToken,
		hasRefreshToken,
		isProtectedRoute,
		isAuthRoute,
	});

	// If the route is protected, check if the user is authenticated
	if (isProtectedRoute) {
		authLog("Processing protected route", { requestId, path: pathname });
		const redirectUrl = new URL("/sign-in", request.url);
		redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

		if (!accessToken) {
			authLog(
				"Access denied - No access token",
				{
					requestId,
					path: pathname,
					redirectTo: redirectUrl.toString(),
				},
				"warn"
			);
			return NextResponse.redirect(redirectUrl);
		}

		try {
			authLog("Verifying access token", { requestId, path: pathname });
			// Verify access token
			const { payload: accessPayload } = await jose.jwtVerify(
				accessToken,
				new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "")
			);

			// If access token is valid, continue
			if (accessPayload && typeof accessPayload.userId === "number") {
				authLog("Access token valid", {
					requestId,
					path: pathname,
					userId: accessPayload.userId,
					tokenExp: accessPayload.exp,
				});
				return NextResponse.next();
			} else {
				authLog(
					"Access token payload invalid",
					{
						requestId,
						path: pathname,
						payload: accessPayload,
					},
					"warn"
				);
			}
		} catch (error) {
			// Access token is invalid, try refresh token
			authLog(
				"Access token verification failed",
				{
					requestId,
					path: pathname,
					error: error instanceof Error ? error.message : String(error),
				},
				"error"
			);

			if (!refreshToken) {
				authLog(
					"No refresh token available",
					{
						requestId,
						path: pathname,
						redirectTo: redirectUrl.toString(),
					},
					"warn"
				);
				return NextResponse.redirect(redirectUrl);
			}

			try {
				authLog("Attempting token refresh", { requestId, path: pathname });
				// Verify refresh token
				const { payload: refreshPayload } = await jose.jwtVerify(
					refreshToken,
					new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "")
				);

				if (!refreshPayload || typeof refreshPayload.userId !== "number") {
					authLog(
						"Invalid refresh token payload",
						{
							requestId,
							path: pathname,
							payload: refreshPayload,
							redirectTo: redirectUrl.toString(),
						},
						"warn"
					);
					return NextResponse.redirect(redirectUrl);
				}

				// Generate new access token
				const userId = refreshPayload.userId as number;
				authLog("Generating new access token", {
					requestId,
					path: pathname,
					userId,
				});

				const newAccessToken = await generateToken(userId, "ACCESS");

				const response = NextResponse.next();

				// Set the new access token as a cookie in the response
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
			} catch (error) {
				// Refresh token is invalid, redirect to login
				authLog(
					"Refresh token verification failed",
					{
						requestId,
						path: pathname,
						error: error instanceof Error ? error.message : String(error),
						redirectTo: redirectUrl.toString(),
					},
					"error"
				);
				return NextResponse.redirect(redirectUrl);
			}
		}
	}

	if (isAuthRoute && accessToken) {
		authLog("User with token accessing auth route", {
			requestId,
			path: pathname,
		});

		try {
			// Verify the access token is valid before redirecting
			const { payload: accessPayload } = await jose.jwtVerify(
				accessToken,
				new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "")
			);

			authLog("Valid token on auth route, redirecting", {
				requestId,
				path: pathname,
				userId:
					typeof accessPayload.userId === "number"
						? accessPayload.userId
						: undefined,
			});

			// redirect where it came from
			const redirectUrl = request.nextUrl.searchParams.get("redirect");
			if (redirectUrl) {
				authLog("Redirecting to original destination", {
					requestId,
					path: pathname,
					redirectTo: redirectUrl,
				});
				return NextResponse.redirect(new URL(redirectUrl, request.url));
			}

			authLog("Redirecting to home", {
				requestId,
				path: pathname,
				redirectTo: "/",
			});
			return NextResponse.redirect(new URL("/", request.url));
		} catch (error) {
			// Token is invalid, let them stay on the auth route
			authLog(
				"Invalid token on auth route",
				{
					requestId,
					path: pathname,
					error: error instanceof Error ? error.message : String(error),
				},
				"warn"
			);
			return NextResponse.next();
		}
	}

	authLog("Auth middleware completed - no action needed", {
		requestId,
		path: pathname,
	});
	return NextResponse.next();
}

// match all paths except home page
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|/).*)"],
};
