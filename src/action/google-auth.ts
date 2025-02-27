"use server";

import { ACCESS_TOKEN_EXPIRES_IN } from "@/constants";
import { db } from "@/lib/db";
import { generateToken } from "@/services/auth/token-service";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

// Get access token from code
export async function getGoogleToken(code: string) {
	if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !REDIRECT_URI) {
		throw new Error("Missing required OAuth configuration");
	}

	const url = "https://oauth2.googleapis.com/token";
	const values = {
		code,
		client_id: GOOGLE_CLIENT_ID,
		client_secret: GOOGLE_CLIENT_SECRET,
		redirect_uri: REDIRECT_URI,
		grant_type: "authorization_code",
	} as const;

	console.log("Token Exchange Config:", {
		clientId: GOOGLE_CLIENT_ID.substring(0, 8) + "...",
		redirectUri: REDIRECT_URI,
		code: code.substring(0, 10) + "...",
	});

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams(values),
			cache: "no-store",
		});

		const data = await response.json();

		if (!response.ok) {
			console.error("Google token error response:", {
				status: response.status,
				statusText: response.statusText,
				error: data,
			});
			throw new Error(
				data.error_description || data.error || "Failed to get access token"
			);
		}

		return data;
	} catch (error) {
		console.error("Error getting Google token:", error);
		throw error;
	}
}

// Get user info from access token
export async function getGoogleUserInfo(
	access_token: string
): Promise<GoogleUserInfo> {
	try {
		const response = await fetch(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				cache: "no-store",
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Google user info error:", errorData);
			throw new Error(errorData.error_description || "Failed to get user info");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error getting Google user info:", error);
		throw error;
	}
}

// Create user with Google data
export async function createUserWithGoogle(googleUser: GoogleUserInfo) {
	// First try to find user by Google ID
	let user = await db.user.findUnique({
		where: { googleId: googleUser.id },
	});

	// If not found by Google ID, try email
	if (!user) {
		user = await db.user.findUnique({
			where: { email: googleUser.email },
		});

		// If user exists with email but no Google ID, update with Google ID
		if (user) {
			user = await db.user.update({
				where: { id: user.id },
				data: { googleId: googleUser.id },
			});
		}
	}

	// If still no user, create new one
	if (!user) {
		// Generate a unique username from email
		const baseUsername = googleUser.email.split("@")[0];
		let username = baseUsername;
		let counter = 1;

		// Keep trying until we find a unique username
		while (await db.user.findUnique({ where: { username } })) {
			username = `${baseUsername}${counter}`;
			counter++;
		}

		user = await db.user.create({
			data: {
				email: googleUser.email,
				username,
				googleId: googleUser.id,
			},
		});
	}

	// Generate auth tokens
	const tokens = await generateToken(
		{ id: user.id },
		process.env.JWT_ACCESS_SECRET!,
		ACCESS_TOKEN_EXPIRES_IN
	);

	return tokens;
}
