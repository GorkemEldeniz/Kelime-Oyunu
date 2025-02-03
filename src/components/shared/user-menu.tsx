"use client";

import { signOut } from "@/action/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Trophy, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface UserMenuProps {
	email: string;
}

export function UserMenu({ email }: UserMenuProps) {
	const router = useRouter();
	const { execute: executeSignOut, isExecuting } = useAction(signOut, {
		onSuccess: () => {
			toast.success("Çıkış yapıldı");
			router.push("/sign-in");
		},
		onError: () => {
			toast.error("Çıkış yapılamadı");
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative'
					disabled={isExecuting}
				>
					<User className='h-5 w-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				<DropdownMenuItem
					onClick={() => router.push("/profile")}
					className='flex flex-col items-start cursor-pointer'
				>
					<span className='text-sm font-medium'>Hesap</span>
					<span className='text-xs text-muted-foreground'>{email}</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push("/standings")}
					className='flex items-center gap-2 cursor-pointer'
				>
					<Trophy className='h-4 w-4' />
					<span className='text-sm font-medium'>Sıralama</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					className='text-red-600 dark:text-red-400 cursor-pointer'
					onClick={() => executeSignOut()}
					disabled={isExecuting}
				>
					<LogOut className='mr-2 h-4 w-4' />
					<span>Çıkış Yap</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
