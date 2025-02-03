"use server";

import { db } from "@/lib/db";
import * as TokenService from "@/lib/services/token-service";
import { SignUpInput } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Constants
const ACCESS_TOKEN_NAME = "token";
const REFRESH_TOKEN_NAME = "refresh_token";

// User authentication methods
export async function getUserByEmail(email: string) {
	return db.user.findUnique({
		where: { email },
	});
}

export async function getUserById(id: number) {
	return db.user.findUnique({
		where: { id },
	});
}

export async function createUser(data: SignUpInput) {
	const hashedPassword = await hashPassword(data.password);

	// Create user first
	const user = await db.user.create({
		data: {
			email: data.email,
			username: data.username,
			password: hashedPassword,
		},
	});

	// Generate tokens
	const accessToken = await TokenService.generateAccessToken(user.id);
	const refreshToken = await TokenService.generateRefreshToken(user.id);

	return {
		user,
		tokens: {
			accessToken,
			refreshToken,
		},
	};
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return bcrypt.compare(password, hashedPassword);
}

async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

// Session management
export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(REFRESH_TOKEN_NAME)?.value;
	if (!token) return null;

	const dbToken = await db.token.findUnique({
		where: { token },
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

// Cookie management
export async function setAuthCookies(
	accessToken: string,
	refreshToken: string
) {
	const cookieStore = await cookies();

	cookieStore.set({
		name: ACCESS_TOKEN_NAME,
		value: accessToken,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
	});

	cookieStore.set({
		name: REFRESH_TOKEN_NAME,
		value: refreshToken,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
	});
}

export async function clearAuthCookies() {
	const cookieStore = await cookies();

	for (const name of [ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME]) {
		cookieStore.delete(name);
		cookieStore.set({
			name,
			value: "",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
			expires: new Date(0),
		});
	}
}

// Auth flow methods
export async function generateAuthTokens(userId: number) {
	// Check for existing valid refresh token
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
		const accessToken = await TokenService.generateAccessToken(userId);
		return { accessToken, refreshToken: existingToken.token };
	}

	// If no valid token exists, clean up old tokens and create new ones
	await db.token.deleteMany({
		where: {
			userId,
			type: "REFRESH",
		},
	});

	const [accessToken, refreshToken] = await Promise.all([
		TokenService.generateAccessToken(userId),
		TokenService.generateRefreshToken(userId),
	]);

	return { accessToken, refreshToken };
}
