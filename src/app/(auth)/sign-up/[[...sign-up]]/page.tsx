import { AuthForm } from "@/components/auth/auth-form";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Kayıt Ol",
	description: "Yeni bir hesap oluştur",
};

export default function SignUpPage() {
	return (
		<main className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0'>
			<div className='lg:p-8'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col space-y-2 text-center'>
						<h1 className='text-2xl font-semibold tracking-tight'>
							Hesap Oluştur
						</h1>
						<p className='text-sm text-muted-foreground'>
							Hesabınızı oluşturmak için e-postanızı girin
						</p>
					</div>
					<AuthForm type='sign-up' />
					<p className='px-8 text-center text-sm text-muted-foreground'>
						<Link
							href='/sign-in'
							className='hover:text-brand underline underline-offset-4'
						>
							Zaten hesabınız var mı? Giriş Yapın
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
