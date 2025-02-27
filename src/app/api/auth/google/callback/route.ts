import {
	createUserWithGoogle,
	getGoogleToken,
	getGoogleUserInfo,
} from "@/action/google-auth";
import { ACCESS_TOKEN_MAX_AGE } from "@/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		// Get the code from the URL
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const error = url.searchParams.get("error");

		// Handle OAuth errors
		if (error) {
			console.error("[GOOGLE_AUTH_ERROR]", error);
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=${error}`
			);
		}

		if (!code) {
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=no_code`
			);
		}

		// Exchange code for tokens
		const tokenResponse = await getGoogleToken(code);

		if (!tokenResponse.access_token) {
			console.error("[GOOGLE_TOKEN_ERROR]", tokenResponse);
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=invalid_token`
			);
		}

		// Get user info from Google
		const googleUser = await getGoogleUserInfo(tokenResponse.access_token);

		// Find or create user in our database and generate token
		const token = await createUserWithGoogle(googleUser);

		// Set auth cookies
		const cookieStore = await cookies();

		cookieStore.set("access_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax" as const,
			expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE),
			maxAge: ACCESS_TOKEN_MAX_AGE,
		});

		// Redirect to home page
		return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
	} catch (error) {
		console.error("[GOOGLE_CALLBACK_ERROR]", error);
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=server_error`
		);
	}
}
