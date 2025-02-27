"use server";

import { db } from "@/lib/db";
import { SignUpInput } from "@/validations/auth";
import { hashPassword } from "./password-service";

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
	// hash password
	const hashedPassword = await hashPassword(data.password);

	const user = await db.user.create({
		data: {
			email: data.email,
			username: data.username,
			password: hashedPassword,
		},
	});

	return user.id;
}
