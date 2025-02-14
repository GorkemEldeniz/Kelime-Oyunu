"use server";

import { db } from "@/lib/db";
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
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	signInSchema,
	signUpSchema,
} from "@/lib/validations/auth";
import { render } from "@react-email/render";
import { hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import * as React from "react";
import { Resend } from "resend";
import ResetPasswordEmail from "../emails/reset-password";

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

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const requestPasswordReset = actionClient
	.schema(forgotPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {
		const user = await db.user.findUnique({
			where: { email },
		});

		if (!user) {
			return {
				error: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.",
			};
		}

		const token = await new SignJWT({ sub: user.id.toString() })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("30m")
			.sign(secret);

		const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

		const emailHtml = await render(
			React.createElement(ResetPasswordEmail, {
				username: user.username,
				resetLink: resetLink,
			})
		);

		await resend.emails.send({
			from: "Kelime Oyunu <noreply@kelimeoyunu.net.tr>",
			to: email,
			subject: "Şifre Sıfırlama",
			html: emailHtml,
		});

		return {
			success: true,
			data: {
				message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
			},
		};
	});

export const resetPassword = actionClient
	.schema(resetPasswordSchema)
	.action(async ({ parsedInput: { token, password } }) => {
		try {
			const { payload } = await jwtVerify(token, secret);
			const userId = payload.sub;

			if (!userId) {
				return {
					error: "Geçersiz token",
				};
			}

			const hashedPassword = await hash(password, 10);

			await db.user.update({
				where: { id: Number(userId) },
				data: { password: hashedPassword },
			});

			return {
				success: true,
				data: {
					message: "Şifreniz başarıyla güncellendi.",
				},
			};
		} catch (error) {
			console.error("[RESET_PASSWORD_ERROR]", error);
			return {
				success: false,
				error: "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
			};
		}
	});
