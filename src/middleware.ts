import { ACCESS_TOKEN_MAX_AGE } from "@/config/auth";
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

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isAuthRoute = authPaths.some(
		(path) => pathname.startsWith(path) && pathname !== "/"
	);
	const isProtectedRoute = protectedPaths.some(
		(path) => pathname.startsWith(path) && pathname !== "/"
	);

	// Get tokens
	const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

	// If the route is protected, check if the user is authenticated
	if (isProtectedRoute) {
		const redirectUrl = new URL("/sign-in", request.url);
		redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

		if (!accessToken) {
			return NextResponse.redirect(redirectUrl);
		}

		const { payload: accessPayload } = await jose.jwtVerify(
			accessToken,
			jose.base64url.decode(process.env.JWT_ACCESS_SECRET!)
		);

		if (!accessPayload || typeof accessPayload.userId !== "number") {
			if (!refreshToken) {
				return NextResponse.redirect(redirectUrl);
			}

			const { payload: refreshPayload } = await jose.jwtVerify(
				refreshToken,
				jose.base64url.decode(process.env.JWT_REFRESH_SECRET!)
			);

			if (!refreshPayload || typeof refreshPayload.userId !== "number") {
				return NextResponse.redirect(redirectUrl);
			}

			// Generate new tokens manually instead of using generateAndStoreTokens
			// which uses server actions that don't work in middleware
			const userId = refreshPayload.userId as number;
			const newAccessToken = await generateToken(userId, "ACCESS");

			// Create a response that continues to the requested page
			const response = NextResponse.next();

			// Set the new tokens as cookies in the response
			response.cookies.set(ACCESS_TOKEN_NAME, newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: ACCESS_TOKEN_MAX_AGE / 1000, // Convert ms to seconds for cookies
			});

			return response;
		}
	}

	if (isAuthRoute && accessToken) {
		// redirect where it came from
		const redirectUrl = request.nextUrl.searchParams.get("redirect");
		if (redirectUrl) {
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}
