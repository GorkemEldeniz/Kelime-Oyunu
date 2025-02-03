import { refreshAccessToken, verifyToken } from "@/lib/services/token-service";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/", "/api/auth/google/callback"]; // Only landing page is public
const authPaths = ["/sign-in", "/sign-up"]; // Auth paths for unauthenticated users

// Cookie names
const ACCESS_TOKEN_NAME = "token";
const REFRESH_TOKEN_NAME = "refresh_token";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Get tokens
	const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
	const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

	// Handle public routes first
	if (publicPaths.some((path) => pathname === path)) {
		return NextResponse.next();
	}

	// Check authentication status
	let isAuthenticated = false;
	let newAccessToken: string | null = null;

	// Try access token first
	if (accessToken) {
		try {
			const decoded = await verifyToken(accessToken);
			if (decoded && decoded.type === "ACCESS") {
				isAuthenticated = true;
			}
		} catch {
			// Access token is invalid, will try refresh token
		}
	}

	// If access token fails, try refresh token
	if (!isAuthenticated && refreshToken) {
		try {
			const decoded = await verifyToken(refreshToken);
			if (decoded && decoded.type === "REFRESH") {
				newAccessToken = await refreshAccessToken(refreshToken);
				if (newAccessToken) {
					isAuthenticated = true;
				}
			}
		} catch {
			// Refresh token is invalid
		}
	}

	// Handle auth routes (sign-in, sign-up)
	if (authPaths.some((path) => pathname.startsWith(path))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return NextResponse.next();
	}

	// Handle protected routes
	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// User is authenticated, allow access
	const response = NextResponse.next();

	// Set new access token if it was refreshed
	if (newAccessToken) {
		response.cookies.set({
			name: ACCESS_TOKEN_NAME,
			value: newAccessToken,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
		});
	}

	return response;
}

// Configure the middleware to run on specific paths
export const config = {
	// Exclude static files and favicon
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public directory)
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/).*)",
	],
};
