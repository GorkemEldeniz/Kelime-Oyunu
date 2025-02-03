"use server";

import { actionClient } from "@/lib/safe-action";
import {
	clearAuthCookies,
	createUser,
	generateAuthTokens,
	getUserByEmail,
	setAuthCookies,
	verifyPassword,
} from "@/lib/services/auth-service";
import {
	invalidateAllRefreshTokens,
	verifyToken,
} from "@/lib/services/token-service";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";

export const signIn = actionClient
	.schema(signInSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		try {
			// Check if user exists
			const user = await getUserByEmail(email);
			if (!user) {
				return {
					success: false,
					error: "Geçersiz kimlik bilgileri",
				};
			}

			// Verify password
			const isValidPassword = await verifyPassword(
				password,
				user.password as string
			);
			if (!isValidPassword) {
				return {
					success: false,
					error: "Hatalı şifre",
				};
			}

			// Generate tokens
			const { accessToken, refreshToken } = await generateAuthTokens(user.id);

			// Set cookies
			await setAuthCookies(accessToken, refreshToken);

			return {
				success: true,
				data: {
					message: "Başarıyla giriş yapıldı",
				},
			};
		} catch (error) {
			console.error("[SIGN_IN_ERROR]", error);
			return {
				success: false,
				error: "Bir şeyler yanlış gitti",
			};
		}
	});

export const signUp = actionClient
	.schema(signUpSchema)
	.action(async ({ parsedInput: { email, password, username } }) => {
		try {
			// Check if user exists
			const existingUser = await getUserByEmail(email);

			if (existingUser) {
				return {
					success: false,
					error: "Bu e-posta adresi zaten kullanılıyor",
				};
			}

			// Create user with initial tokens
			const { tokens } = await createUser({
				email,
				password,
				username,
			});

			// Set cookies
			await setAuthCookies(tokens.accessToken, tokens.refreshToken);

			return {
				success: true,
				data: {
					message: "Hesap başarıyla oluşturuldu",
				},
			};
		} catch (error) {
			console.error("[SIGN_UP_ERROR]", error);
			return {
				success: false,
				error: "Bir şeyler yanlış gitti",
			};
		}
	});

export const signOut = actionClient.action(async () => {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refresh_token")?.value;

		if (refreshToken) {
			// Verify token to get user ID
			const decoded = await verifyToken(refreshToken);
			if (decoded?.userId) {
				// Invalidate all refresh tokens
				await invalidateAllRefreshTokens(decoded.userId);
			}
		}

		// Clear cookies
		await clearAuthCookies();

		return {
			success: true,
			data: {
				message: "Başarıyla çıkış yapıldı",
			},
		};
	} catch (error) {
		console.error("[SIGN_OUT_ERROR]", error);
		return {
			success: false,
			error: "Bir şeyler yanlış gitti",
		};
	}
});
