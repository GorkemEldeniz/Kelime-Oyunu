import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email("Geçerli bir e-posta adresi girin"),
	password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const signUpSchema = z.object({
	email: z.string().email("Geçerli bir e-posta adresi girin"),
	password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
	username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email({
		message: "Geçerli bir e-posta adresi giriniz.",
	}),
});

export const resetPasswordSchema = z
	.object({
		token: z.string(),
		password: z.string().min(6, {
			message: "Şifre en az 6 karakter olmalıdır.",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Şifreler eşleşmiyor.",
		path: ["confirmPassword"],
	});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
