"use server";

import { REFRESH_TOKEN_MAX_AGE, RESET_TOKEN_EXPIRES_IN } from "@/config/auth";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import {
	clearAuthCookies,
	setAuthCookies,
} from "@/services/auth/cookie-service";
import { generateAuthTokens } from "@/services/auth/index";
import { verifyPassword } from "@/services/auth/password-service";
import { createUser, getUserByEmail } from "@/services/auth/user-service";
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	signInSchema,
	signUpSchema,
} from "@/validations/auth";
import { render } from "@react-email/render";
import { hash } from "bcryptjs";
import * as jose from "jose";
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

			// delete old refresh token for user
			await db.token.deleteMany({
				where: {
					userId: user.id,
					type: "REFRESH",
				},
			});

			// create new refresh token
			await db.token.create({
				data: {
					userId: user.id,
					type: "REFRESH",
					token: refreshToken,
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
				},
			});

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

export const requestPasswordReset = actionClient
	.schema(forgotPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {
		try {
			const user = await getUserByEmail(email);

			if (!user) {
				return {
					error: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.",
				};
			}

			const token = await new jose.SignJWT({ sub: user.id.toString() })
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime(RESET_TOKEN_EXPIRES_IN)
				.sign(jose.base64url.decode(process.env.JWT_RESET_SECRET!));

			const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

			const emailHtml = await render(
				ResetPasswordEmail({
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
		} catch (error) {
			console.error("[REQUEST_PASSWORD_RESET_ERROR]", error);
			return {
				success: false,
				error: "Şifre sıfırlama e-postası gönderilirken bir hata oluştu.",
			};
		}
	});

export const resetPassword = actionClient
	.schema(resetPasswordSchema)
	.action(async ({ parsedInput: { token, password } }) => {
		try {
			const { payload } = await jose.jwtVerify(
				token,
				jose.base64url.decode(process.env.JWT_RESET_SECRET!)
			);
			const userId = payload.sub;

			if (!userId) {
				return {
					error: "Geçersiz token",
				};
			}

			await db.user.update({
				where: { id: Number(userId) },
				data: { password: await hash(password, 10) },
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
