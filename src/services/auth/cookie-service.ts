"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { verifyToken } from "./token-service";
export async function clearAuthCookies() {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");
	cookieStore.delete("refresh_token");
}

export async function getRefreshToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get("refresh_token")?.value;
}

export async function getUserFromCookie(): Promise<jose.JWTPayload | null> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken) return null;

	const payload = await verifyToken(
		accessToken,
		process.env.JWT_ACCESS_SECRET!
	);

	if (!payload) return null;

	return payload;
}
