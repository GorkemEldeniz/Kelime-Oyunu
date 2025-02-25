"use server";

import { db } from "@/lib/db";
import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
	return hash(password, 10);
}

export async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return compare(password, hashedPassword);
}

export async function updatePassword(userId: number, newPassword: string) {
	const hashedPassword = await hashPassword(newPassword);
	return db.user.update({
		where: { id: userId },
		data: { password: hashedPassword },
	});
}
