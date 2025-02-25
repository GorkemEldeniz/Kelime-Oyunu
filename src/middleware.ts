import {
	generateAndStoreTokens,
	verifyAndDecodeToken,
} from "@/services/auth/token-service";
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

	const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));
	const isProtectedRoute = protectedPaths.some((path) =>
		pathname.startsWith(path)
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

		const decodedAccessToken = await verifyAndDecodeToken(
			accessToken,
			"ACCESS"
		);

		if (!decodedAccessToken) {
			if (!refreshToken) {
				return NextResponse.redirect(redirectUrl);
			}

			const decodedRefreshToken = await verifyAndDecodeToken(
				refreshToken,
				"REFRESH"
			);
			if (!decodedRefreshToken) {
				return NextResponse.redirect(redirectUrl);
			}

			await generateAndStoreTokens(decodedRefreshToken.userId as number);
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
