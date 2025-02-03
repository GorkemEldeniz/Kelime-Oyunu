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

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
