"use server";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/config/auth";
import { db } from "@/lib/db";
import { CreateUserResult } from "@/types/auth";
import { SignUpInput } from "@/validations/auth";
import { hashPassword } from "./password-service";
import { generateToken } from "./token-service";

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

export async function createUser(data: SignUpInput): Promise<CreateUserResult> {
	const hashedPassword = await hashPassword(data.password);

	const user = await db.user.create({
		data: {
			email: data.email,
			username: data.username,
			password: hashedPassword,
		},
		select: {
			id: true,
			email: true,
			username: true,
		},
	});

	const [accessToken, refreshToken] = await Promise.all([
		generateToken(user.id, "ACCESS"),
		generateToken(user.id, "REFRESH"),
	]);

	// create new refresh token
	await db.token.create({
		data: {
			userId: user.id,
			type: "REFRESH",
			token: refreshToken,
			expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
		},
	});

	return {
		user,
		tokens: {
			accessToken,
			refreshToken,
		},
	};
}
