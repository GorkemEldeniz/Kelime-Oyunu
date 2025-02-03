"use server";

import { SignUpInput } from "@/lib/auth-scheme";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
	process.env.JWT_ACCESS_SECRET!
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
	process.env.JWT_REFRESH_SECRET!
);
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "1d";

export type TokenType = "ACCESS" | "REFRESH";

interface JWTPayload {
	userId: number;
	type: TokenType;
}

// Helper function to hash password
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

// Helper function to compare password
export async function comparePassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}

// Helper function to generate access token (not stored in db)
export async function generateAccessToken(userId: number): Promise<string> {
	const jwt = await new jose.SignJWT({ userId, type: "ACCESS" as TokenType })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
		.sign(JWT_ACCESS_SECRET);
	return jwt;
}

// Helper function to generate and store refresh token
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

// Helper function to cleanup expired tokens
export async function cleanupExpiredTokens() {
	await db.token.deleteMany({
		where: {
			expiresAt: {
				lt: new Date(), // Tokens that have expired
			},
		},
	});
}

// Helper function to verify token
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

// Type guard for JWTPayload
const isJWTPayload = (payload: unknown): payload is JWTPayload => {
	return (
		typeof payload === "object" &&
		payload !== null &&
		"userId" in payload &&
		typeof (payload as { userId: number }).userId === "number" &&
		"type" in payload &&
		((payload as { type: string }).type === "ACCESS" ||
			(payload as { type: string }).type === "REFRESH")
	);
};

// Helper function to get user by email
export async function getUserByEmail(email: string) {
	return db.user.findUnique({
		where: { email },
	});
}

// Helper function to get user by id
export async function getUserById(id: number) {
	return db.user.findUnique({
		where: { id },
	});
}

interface CreateUserResult {
	user: Awaited<ReturnType<typeof db.user.create>>;
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

// Helper function to create user with initial tokens
export async function createUser(data: SignUpInput): Promise<CreateUserResult> {
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
	const accessToken = await generateAccessToken(user.id);
	const refreshToken = await generateRefreshToken(user.id);

	return {
		user,
		tokens: {
			accessToken,
			refreshToken,
		},
	};
}

// Helper function to invalidate all refresh tokens
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

// Helper function to refresh access token
export async function refreshAccessToken(
	refreshToken: string
): Promise<string | null> {
	const decoded = await verifyToken(refreshToken);

	if (!decoded || decoded.type !== "REFRESH") {
		return null;
	}

	// Generate new access token (not stored in db)
	return await generateAccessToken(decoded.userId);
}

// Helper function to generate both tokens (for sign in)
export async function generateAuthTokens(userId: number) {
	// Check for existing valid refresh token
	const existingToken = await db.token.findFirst({
		where: {
			userId,
			type: "REFRESH",
			expiresAt: {
				gt: new Date(), // Token that hasn't expired yet
			},
		},
		orderBy: {
			createdAt: "desc", // Get the most recent one
		},
	});

	// If we have a valid token, use it
	if (existingToken) {
		const accessToken = await generateAccessToken(userId);
		return { accessToken, refreshToken: existingToken.token };
	}

	// If no valid token exists, clean up old tokens and create new ones
	await db.token.deleteMany({
		where: {
			userId,
			type: "REFRESH",
		},
	});

	// Generate new tokens
	const [accessToken, refreshToken] = await Promise.all([
		generateAccessToken(userId),
		generateRefreshToken(userId),
	]);

	return { accessToken, refreshToken };
}

export async function auth() {
	const cookieStore = await cookies();
	const token = cookieStore.get("refresh_token")?.value;
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
