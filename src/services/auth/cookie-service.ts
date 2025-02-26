"use server";

import { COOKIE_CONFIG } from "@/config/auth";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "@/constants";
import { cookies } from "next/headers";

export async function setAuthCookies(
	accessToken: string,
	refreshToken: string
) {
	const cookieStore = await cookies();

	cookieStore.set("access_token", accessToken, {
		...COOKIE_CONFIG,
		maxAge: ACCESS_TOKEN_MAX_AGE,
	});

	cookieStore.set("refresh_token", refreshToken, {
		...COOKIE_CONFIG,
		maxAge: REFRESH_TOKEN_MAX_AGE,
	});
}

export async function clearAuthCookies() {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");
	cookieStore.delete("refresh_token");
}

export async function getRefreshToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get("refresh_token")?.value;
}
