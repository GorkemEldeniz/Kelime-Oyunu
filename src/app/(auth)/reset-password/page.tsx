import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PageHeader } from "@/components/shared/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Şifre Sıfırlama",
	description: "Yeni şifrenizi belirleyin",
};

interface ResetPasswordPageProps {
	searchParams: Promise<{
		token?: string;
	}>;
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
	const searchParams = await props.searchParams;
	const token = searchParams.token;

	if (!token) {
		return (
			<div className='container max-w-4xl py-8 space-y-8'>
				<PageHeader title='Geçersiz Bağlantı' icon='XCircle' />
				<div className='bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10'>
					<p className='text-muted-foreground'>
						Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='container min-h-screen max-w-4xl py-8 space-y-8'>
			<PageHeader title='Yeni Şifre Belirleme' icon='KeyRound' />
			<div className='bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10'>
				<div className='max-w-[350px] mx-auto'>
					<p className='text-sm text-muted-foreground mb-6'>
						Lütfen yeni şifrenizi belirleyin.
					</p>
					<ResetPasswordForm token={token} />
				</div>
			</div>
		</div>
	);
}
