import { z } from "zod";

export const signUpSchema = z.object({
	username: z
		.string()
		.min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
		.max(20, "Kullanıcı adı en fazla 20 karakter olmalıdır")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir"
		),
	email: z.string().email("Lütfen geçerli bir e-posta adresi girin"),
	password: z
		.string()
		.min(8, "Şifre en az 8 karakter olmalıdır")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
			"Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
		),
});

export const signInSchema = z.object({
	email: z.string().email("Lütfen geçerli bir e-posta adresi girin"),
	password: z.string().min(1, "Şifre gereklidir"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
