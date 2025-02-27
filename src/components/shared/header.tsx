"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface HeaderProps {
	user: {
		email: string;
		username: string;
	};
}

export function Header({ user }: HeaderProps) {
	return (
		<header className='border-b'>
			<div className='container mx-auto px-4 h-16 flex items-center justify-between'>
				<Link
					href='/'
					className='text-xl font-semibold hover:text-primary transition-colors'
				>
					Kelime Oyunu
				</Link>

				<div className='flex items-center gap-4'>
					<ThemeToggle />
					<UserMenu name={user.username ?? user.email} />
				</div>
			</div>
		</header>
	);
}
