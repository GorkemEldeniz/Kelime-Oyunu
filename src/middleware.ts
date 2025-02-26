import { COOKIE_CONFIG } from "@/config/auth";
import { generateToken } from "@/services/auth/token-service";
import * as jose from "jose";
import { cookies } from "next/headers";
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

	const isProtectedRoute = protectedPaths.includes(pathname);
	const isAuthRoute = authPaths.includes(pathname);

	// Get tokens
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = cookieStore.get(REFRESH_TOKEN_NAME)?.value;

	// If the route is protected, check if the user is authenticated
	if (isProtectedRoute) {
		const redirectUrl = new URL("/sign-in", request.url);
		redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);

		if (!accessToken) {
			return NextResponse.redirect(redirectUrl);
		}

		try {
			// Verify access token
			const { payload: accessPayload } = await jose.jwtVerify(
				accessToken,
				jose.base64url.decode(process.env.JWT_ACCESS_SECRET ?? "")
			);

			// If access token is valid, continue
			if (accessPayload && typeof accessPayload.userId === "number") {
				return NextResponse.next();
			}
		} catch (error) {
			// Access token is invalid, try refresh token
			console.error("Access token verification error:", error);

			if (!refreshToken) {
				return NextResponse.redirect(redirectUrl);
			}

			try {
				// Verify refresh token
				const { payload: refreshPayload } = await jose.jwtVerify(
					refreshToken,
					jose.base64url.decode(process.env.JWT_REFRESH_SECRET ?? "")
				);

				if (!refreshPayload || typeof refreshPayload.userId !== "number") {
					return NextResponse.redirect(redirectUrl);
				}

				// Generate new access token
				const userId = refreshPayload.userId as number;
				const newAccessToken = await generateToken(userId, "ACCESS");

				// Set the new access token as a cookie in the response
				cookieStore.set(ACCESS_TOKEN_NAME, newAccessToken, {
					...COOKIE_CONFIG,
				});

				return NextResponse.next();
			} catch (error) {
				// Refresh token is invalid, redirect to login
				console.error("Refresh token verification error:", error);
				return NextResponse.redirect(redirectUrl);
			}
		}
	}

	if (isAuthRoute && accessToken) {
		try {
			// Verify the access token is valid before redirecting
			await jose.jwtVerify(
				accessToken,
				jose.base64url.decode(process.env.JWT_ACCESS_SECRET ?? "")
			);

			// redirect where it came from
			const redirectUrl = request.nextUrl.searchParams.get("redirect");
			if (redirectUrl) {
				return NextResponse.redirect(new URL(redirectUrl, request.url));
			}
			return NextResponse.redirect(new URL("/", request.url));
		} catch (error) {
			// Token is invalid, let them stay on the auth route
			console.error("Auth route token verification error:", error);
			return NextResponse.next();
		}
	}

	return NextResponse.next();
}
