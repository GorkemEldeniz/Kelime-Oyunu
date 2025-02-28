import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./services/auth/token-service";

const protectedRoutes = ["/game", "/profile", "/standings"];
const authRoutes = [
	"/sign-in",
	"/sign-up",
	"/forgot-password",
	"/reset-password",
];

export async function middleware(request: NextRequest) {
	const { pathname, href } = request.nextUrl;
	const requestId = Math.random().toString(36).substring(7); // For tracking request flow

	console.log(`[${requestId}] Processing request for: ${pathname}`);
	console.log(
		`[${requestId}] isProtectedRoute: ${protectedRoutes.includes(pathname)}`
	);
	console.log(`[${requestId}] isAuthRoute: ${authRoutes.includes(pathname)}`);

	const isProtectedRoute = protectedRoutes.includes(pathname);
	const isAuthRoute = authRoutes.includes(pathname);

	// Get access token directly from request cookies
	const accessToken = request.cookies.get("access_token")?.value;
	console.log(`[${requestId}] accessToken exists: ${!!accessToken}`);

	// Create redirect URL to sign-in page with full redirect parameters
	const redirectUrl = new URL("/sign-in", request.url);
	redirectUrl.searchParams.set("redirectUrl", href);

	// validate access token
	try {
		console.log(`[${requestId}] Verifying access token`);
		const decoded = await verifyToken(
			accessToken ?? "",
			process.env.JWT_ACCESS_SECRET!
		);

		if (isProtectedRoute) {
			console.log(`[${requestId}] Handling protected route: ${pathname}`);

			if (!decoded?.id) {
				console.log(`[${requestId}] Invalid token, redirecting to sign-in`);
				return NextResponse.redirect(redirectUrl);
			}

			console.log(
				`[${requestId}] Valid token for protected route, proceeding to: ${pathname}`
			);
			// Create a new response to ensure we're not carrying over any redirect headers
			const response = NextResponse.next();
			console.log(
				`[${requestId}] Response created, returning NextResponse.next()`
			);
			return response;
		}

		if (isAuthRoute && decoded) {
			console.log(`[${requestId}] Handling auth route with token: ${pathname}`);
			// Check if there's a redirectUrl parameter and use it for redirection
			const redirectPath = request.nextUrl.searchParams.get("redirectUrl");
			if (redirectPath) {
				console.log(`[${requestId}] Found redirectUrl: ${redirectPath}`);
				const originalUrl = new URL(redirectPath);
				// Make sure we're not redirecting to an external site
				const safeRedirectUrl = new URL(
					originalUrl.pathname + originalUrl.search,
					request.url
				);
				console.log(
					`[${requestId}] Redirecting to original destination:`,
					safeRedirectUrl.toString()
				);
				return NextResponse.redirect(safeRedirectUrl);
			}
			console.log(
				`[${requestId}] Authenticated user on auth route, redirecting to home`
			);
			return NextResponse.redirect(new URL("/", request.url));
		}

		console.log(
			`[${requestId}] No special handling needed, proceeding normally`
		);
		return NextResponse.next();
	} catch (error) {
		console.error(`[${requestId}] Error verifying token:`, error);
		return NextResponse.redirect(redirectUrl);
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
