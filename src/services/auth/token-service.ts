"use server";

import {
	ACCESS_TOKEN_EXPIRES_IN,
	JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET,
	REFRESH_TOKEN_EXPIRES_IN,
} from "@/config/auth";
import { db } from "@/lib/db";
import { TokenType } from "@/types/auth";
import * as jose from "jose";
import { setAuthCookies } from "./cookie-service";

export async function generateToken(
	userId: number,
	type: TokenType
): Promise<string> {
	return new jose.SignJWT({ userId, type })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(
			type === "ACCESS" ? ACCESS_TOKEN_EXPIRES_IN : REFRESH_TOKEN_EXPIRES_IN
		)
		.sign(JWT_ACCESS_SECRET);
}

export async function verifyAndDecodeToken(
	token: string,
	type: TokenType
): Promise<jose.JWTPayload | null> {
	try {
		const { payload } = await jose.jwtVerify(
			token,
			type === "ACCESS" ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET
		);
		return payload;
	} catch (error) {
		console.error("Token is invalid", error);
		return null;
	}
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
			expiresAt: new Date(),
		},
	});
}

export async function refreshAccessToken(
	refreshToken: string
): Promise<string | null> {
	const { payload } = await jose.jwtVerify(refreshToken, JWT_REFRESH_SECRET);

	return generateToken(payload?.userId as number, "ACCESS");
}

export async function generateAndStoreTokens(userId: number) {
	const accessToken = await generateToken(userId, "ACCESS");
	const refreshToken = await generateToken(userId, "REFRESH");

	// delete refresh token for the user
	await db.token.deleteMany({
		where: {
			userId,
			type: "REFRESH",
		},
	});

	// create a new refresh token
	await db.token.create({
		data: {
			userId,
			token: refreshToken,
			type: "REFRESH",
			expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
		},
	});

	setAuthCookies(accessToken, refreshToken);
}
