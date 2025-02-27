"use server";

import { db } from "@/lib/db";
import { AuthUser } from "@/types/auth";
import { cookies } from "next/headers";
import { verifyToken } from "./token-service";

export async function auth(): Promise<{ user: AuthUser } | null> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("access_token")?.value;

		if (!accessToken) {
			return null;
		}

		const payload = await verifyToken(
			accessToken,
			process.env.JWT_ACCESS_SECRET!
		);

		if (!payload) {
			return null;
		}

		const user = await db.user.findUnique({
			where: { id: payload.id as number },
		});

		if (!user) {
			console.error("User not found in database");
			return null;
		}

		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		};
	} catch (error) {
		console.error("Auth function error:", error);
		return null;
	}
}
