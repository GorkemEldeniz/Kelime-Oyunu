"use server";

import { db } from "@/lib/db";
import { AuthUser } from "@/types/auth";
import { cookies } from "next/headers";
import { generateToken } from "./token-service";

export async function generateAuthTokens(userId: number) {
	const existingToken = await db.token.findFirst({
		where: {
			userId,
			type: "REFRESH",
			expiresAt: {
				gt: new Date(),
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (existingToken) {
		const accessToken = await generateToken(userId, "ACCESS");
		return { accessToken, refreshToken: existingToken.token };
	}

	await db.token.deleteMany({
		where: {
			userId,
			type: "REFRESH",
		},
	});

	const [accessToken, refreshToken] = await Promise.all([
		generateToken(userId, "ACCESS"),
		generateToken(userId, "REFRESH"),
	]);

	return { accessToken, refreshToken };
}

export async function auth(): Promise<{ user: AuthUser } | null> {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refresh_token")?.value;

	if (!refreshToken) return null;

	const dbToken = await db.token.findUnique({
		where: { token: refreshToken },
		include: { user: true },
	});

	if (!dbToken || dbToken.expiresAt < new Date()) return null;

	return {
		user: {
			id: dbToken.user.id,
			email: dbToken.user.email,
			username: dbToken.user.username,
		},
	};
}
