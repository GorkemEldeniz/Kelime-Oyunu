import { AuthForm } from "@/components/auth/auth-form";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Giriş Yap",
	description: "Hesabınıza giriş yapın",
};

export default function SignInPage() {
	return (
		<main className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0'>
			<div className='lg:p-8'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col space-y-2 text-center'>
						<h1 className='text-2xl font-semibold tracking-tight'>
							Tekrar Hoşgeldiniz
						</h1>
						<p className='text-sm text-muted-foreground'>
							Hesabınıza giriş yapmak için e-postanızı girin
						</p>
					</div>
					<AuthForm type='sign-in' />
					<div className='flex flex-col space-y-2 text-center text-sm'>
						<Link
							href='/forgot-password'
							className='text-muted-foreground hover:text-brand underline underline-offset-4'
						>
							Şifrenizi mi unuttunuz?
						</Link>
						<Link
							href='/sign-up'
							className='text-muted-foreground hover:text-brand underline underline-offset-4'
						>
							Hesabınız yok mu? Kayıt Olun
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
