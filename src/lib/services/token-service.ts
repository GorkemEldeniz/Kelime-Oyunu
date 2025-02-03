"use server";

import { db } from "@/lib/db";
import * as jose from "jose";

export type TokenType = "ACCESS" | "REFRESH";

interface JWTPayload {
	userId: number;
	type: TokenType;
}

// Constants
const JWT_ACCESS_SECRET = new TextEncoder().encode(
	process.env.JWT_ACCESS_SECRET!
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
	process.env.JWT_REFRESH_SECRET!
);
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "1d";

// Token generation
export async function generateAccessToken(userId: number): Promise<string> {
	return new jose.SignJWT({ userId, type: "ACCESS" as TokenType })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
		.sign(JWT_ACCESS_SECRET);
}

export async function generateRefreshToken(userId: number): Promise<string> {
	const jwt = await new jose.SignJWT({ userId, type: "REFRESH" as TokenType })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
		.sign(JWT_REFRESH_SECRET);

	// Calculate expiration date
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

	// Store refresh token in database
	await db.token.create({
		data: {
			userId,
			token: jwt,
			type: "REFRESH",
			expiresAt,
			createdAt: new Date(),
		},
	});

	return jwt;
}

// Token verification
export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		// First try with access token secret
		try {
			const { payload } = await jose.jwtVerify(token, JWT_ACCESS_SECRET);
			if (isJWTPayload(payload) && payload.type === "ACCESS") {
				return payload;
			}
		} catch {}

		// If that fails, try with refresh token secret
		try {
			const { payload } = await jose.jwtVerify(token, JWT_REFRESH_SECRET);
			if (isJWTPayload(payload) && payload.type === "REFRESH") {
				return payload;
			}
		} catch {}

		return null;
	} catch {
		return null;
	}
}

// Token management
export async function invalidateAllRefreshTokens(userId: number) {
	await db.token.updateMany({
		where: {
			userId,
			type: "REFRESH",
			expiresAt: {
				gt: new Date(),
			},
		},
		data: {
			expiresAt: new Date(), // Expire immediately
		},
	});
}

export async function cleanupExpiredTokens() {
	await db.token.deleteMany({
		where: {
			expiresAt: {
				lt: new Date(),
			},
		},
	});
}

export async function refreshAccessToken(
	refreshToken: string
): Promise<string | null> {
	const decoded = await verifyToken(refreshToken);

	if (!decoded || decoded.type !== "REFRESH") {
		return null;
	}

	return generateAccessToken(decoded.userId);
}

// Helper methods
function isJWTPayload(payload: unknown): payload is JWTPayload {
	return (
		typeof payload === "object" &&
		payload !== null &&
		"userId" in payload &&
		typeof (payload as { userId: number }).userId === "number" &&
		"type" in payload &&
		((payload as { type: string }).type === "ACCESS" ||
			(payload as { type: string }).type === "REFRESH")
	);
}
