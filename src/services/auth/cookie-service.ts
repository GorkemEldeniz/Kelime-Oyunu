"use server";

import { cookies } from "next/headers";

export async function clearAuthCookies() {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");
	cookieStore.delete("refresh_token");
}

export async function getRefreshToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get("refresh_token")?.value;
}
