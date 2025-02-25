"use client";

import { resetPassword } from "@/action/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ResetPasswordInput, resetPasswordSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
	token: string;
}

export function ResetPasswordForm({
	token,
	className,
	...props
}: ResetPasswordFormProps) {
	const router = useRouter();
	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
			token,
		},
	});

	const { execute, status } = useAction(resetPassword, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.data?.message);
				router.push("/sign-in");
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
		onError: (data) => {
			toast.error(data.error.serverError || "Şifre sıfırlama hatası");
		},
	});

	const isLoading = status === "executing";

	async function onSubmit(data: ResetPasswordInput) {
		execute(data);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid gap-4'>
					<div className='grid gap-1'>
						<Input
							id='password'
							placeholder='Yeni Şifre'
							type='password'
							autoCapitalize='none'
							autoComplete='new-password'
							autoCorrect='off'
							disabled={isLoading}
							{...form.register("password")}
						/>
						{form.formState.errors.password && (
							<p className='text-sm text-red-500'>
								{form.formState.errors.password.message}
							</p>
						)}
					</div>
					<div className='grid gap-1'>
						<Input
							id='confirmPassword'
							placeholder='Şifre Tekrar'
							type='password'
							autoCapitalize='none'
							autoComplete='new-password'
							autoCorrect='off'
							disabled={isLoading}
							{...form.register("confirmPassword")}
						/>
						{form.formState.errors.confirmPassword && (
							<p className='text-sm text-red-500'>
								{form.formState.errors.confirmPassword.message}
							</p>
						)}
					</div>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? (
							<Loader className='h-4 w-4 animate-spin' />
						) : (
							"Şifreyi Güncelle"
						)}
					</Button>
				</div>
			</form>
			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>Veya</span>
				</div>
			</div>
			<Button
				variant='outline'
				type='button'
				disabled={isLoading}
				onClick={() => router.push("/sign-in")}
			>
				Giriş Yap
			</Button>
		</div>
	);
}
