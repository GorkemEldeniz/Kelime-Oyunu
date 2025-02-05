"use client";

import { signIn, signUp } from "@/action/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGoogleOAuthURL } from "@/helpers";
import {
	SignInInput,
	SignUpInput,
	signInSchema,
	signUpSchema,
} from "@/lib/auth-scheme";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	type: "sign-in" | "sign-up";
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
	const router = useRouter();

	const signInForm = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signUpForm = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			username: "",
		},
	});

	const { execute: executeSignIn, status: signInStatus } = useAction(signIn, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.data?.message);
				router.push("/game");
				router.refresh();
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
		onError: (data) => {
			toast.error(data.error.serverError || "Giriş başarısız");
		},
	});

	const { execute: executeSignUp, status: signUpStatus } = useAction(signUp, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success(data.data?.message);
				router.push("/game");
				router.refresh();
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
		onError: ({ error }) => {
			if (typeof error === "string") {
				toast.error(error);
			} else {
				toast.error("Giriş başarısız");
			}
		},
	});

	const isLoading =
		signInStatus === "executing" || signUpStatus === "executing";

	async function onSignInSubmit(data: SignInInput) {
		const formData = {
			email: data.email.trim(),
			password: data.password,
		};
		executeSignIn(formData);
	}

	async function onSignUpSubmit(data: SignUpInput) {
		const formData = {
			email: data.email.trim(),
			password: data.password,
			username: data.username.trim(),
		};
		executeSignUp(formData);
	}

	if (type === "sign-in") {
		return (
			<div className={cn("grid gap-6", className)} {...props}>
				<form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
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
								{...signInForm.register("email")}
							/>
							{signInForm.formState.errors.email && (
								<p className='text-sm text-red-500'>
									{signInForm.formState.errors.email.message}
								</p>
							)}
						</div>
						<div className='grid gap-1'>
							<Input
								id='password'
								placeholder='Şifre'
								type='password'
								autoCapitalize='none'
								autoComplete='current-password'
								autoCorrect='off'
								disabled={isLoading}
								{...signInForm.register("password")}
							/>
							{signInForm.formState.errors.password && (
								<p className='text-sm text-red-500'>
									{signInForm.formState.errors.password.message}
								</p>
							)}
						</div>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? (
								<Loader className='h-4 w-4 animate-spin' />
							) : (
								"Giriş Yap"
							)}
						</Button>
					</div>
				</form>
				<div className='relative'>
					<div className='absolute inset-0 flex items-center'>
						<span className='w-full border-t' />
					</div>
					<div className='relative flex justify-center text-xs uppercase'>
						<span className='bg-background px-2 text-muted-foreground'>
							Veya şununla devam et
						</span>
					</div>
				</div>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
					onClick={() => router.push(getGoogleOAuthURL())}
				>
					Google
				</Button>
			</div>
		);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
				<div className='grid gap-4'>
					<div className='grid gap-1'>
						<Input
							id='username'
							placeholder='Kullanıcı Adı'
							type='text'
							autoCapitalize='none'
							autoComplete='username'
							autoCorrect='off'
							disabled={isLoading}
							{...signUpForm.register("username")}
						/>
						{signUpForm.formState.errors.username && (
							<p className='text-sm text-red-500'>
								{signUpForm.formState.errors.username.message}
							</p>
						)}
					</div>
					<div className='grid gap-1'>
						<Input
							id='email'
							placeholder='E-posta'
							type='email'
							autoCapitalize='none'
							autoComplete='email'
							autoCorrect='off'
							disabled={isLoading}
							{...signUpForm.register("email")}
						/>
						{signUpForm.formState.errors.email && (
							<p className='text-sm text-red-500'>
								{signUpForm.formState.errors.email.message}
							</p>
						)}
					</div>
					<div className='grid gap-1'>
						<Input
							id='password'
							placeholder='Şifre'
							type='password'
							autoCapitalize='none'
							autoComplete='new-password'
							autoCorrect='off'
							disabled={isLoading}
							{...signUpForm.register("password")}
						/>
						{signUpForm.formState.errors.password && (
							<p className='text-sm text-red-500'>
								{signUpForm.formState.errors.password.message}
							</p>
						)}
					</div>
					<Button disabled={isLoading}>
						{isLoading ? (
							<Loader className='h-4 w-4 animate-spin' />
						) : (
							"Kayıt Ol"
						)}
					</Button>
				</div>
			</form>
			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>
						Veya şununla devam et
					</span>
				</div>
			</div>
			<Button
				variant='outline'
				type='button'
				disabled={isLoading}
				onClick={() => router.push(getGoogleOAuthURL())}
			>
				Google
			</Button>
		</div>
	);
}
