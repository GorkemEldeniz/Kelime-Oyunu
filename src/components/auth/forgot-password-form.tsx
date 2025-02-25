"use client";

import { requestPasswordReset } from "@/action/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	forgotPasswordSchema,
	type ForgotPasswordInput,
} from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ForgotPasswordForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const router = useRouter();
	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const { execute, status } = useAction(requestPasswordReset, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.data?.message);
				router.push("/game");
				router.refresh();
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
		onError: (error) => {
			toast.error(error.error.serverError || "Şifre sıfırlama hatası");
		},
	});

	const isLoading = status === "executing";

	async function onSubmit(data: ForgotPasswordInput) {
		execute(data);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='grid gap-4'>
					<div className='grid gap-1'>
						<Input
							id='email'
							placeholder='E-posta'
							type='email'
							autoCapitalize='none'
							autoComplete='email'
							autoCorrect='off'
							disabled={isLoading}
							{...form.register("email")}
						/>
						{form.formState.errors.email && (
							<p className='text-sm text-red-500'>
								{form.formState.errors.email.message}
							</p>
						)}
					</div>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? (
							<Loader className='h-4 w-4 animate-spin' />
						) : (
							"Şifre Sıfırlama Bağlantısı Gönder"
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
