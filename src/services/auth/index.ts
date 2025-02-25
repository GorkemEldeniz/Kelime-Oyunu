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

	const [accessToken, refreshToken] = await Promise.all([
		generateToken(userId, "ACCESS"),
		generateToken(userId, "REFRESH"),
	]);

	// store tokens in db
	await db.token.create({
		data: {
			token: refreshToken,
			userId,
			type: "REFRESH",
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // one day
		},
	});

	console.log("token stored");

	return { accessToken, refreshToken };
}

export async function auth(): Promise<{ user: AuthUser } | null> {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refresh_token")?.value;

		if (!refreshToken) {
			return null;
		}

		const dbToken = await db.token.findUnique({
			where: { token: refreshToken },
			include: { user: true },
		});

		if (!dbToken) {
			console.error("Token not found in database");
			return null;
		}

		if (dbToken.expiresAt < new Date()) {
			console.error("Token has expired");
			return null;
		}

		return {
			user: {
				id: dbToken.user.id,
				email: dbToken.user.email,
				username: dbToken.user.username,
			},
		};
	} catch (error) {
		console.error("Auth function error:", error);
		return null;
	}
}
