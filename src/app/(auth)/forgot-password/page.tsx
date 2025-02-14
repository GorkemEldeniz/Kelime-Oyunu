import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Şifremi Unuttum",
	description: "Şifre sıfırlama e-postası gönder",
};

export default function ForgotPasswordPage() {
	return (
		<div className='container flex h-screen w-screen flex-col items-center justify-center'>
			<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
				<div className='flex flex-col space-y-2 text-center'>
					<h1 className='text-2xl font-semibold tracking-tight'>
						Şifremi Unuttum
					</h1>
					<p className='text-sm text-muted-foreground'>
						E-posta adresinizi girin, size şifre sıfırlama bağlantısı
						gönderelim.
					</p>
				</div>
				<ForgotPasswordForm />
			</div>
		</div>
	);
}
