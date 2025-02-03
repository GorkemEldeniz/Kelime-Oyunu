"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface HeaderProps {
	userEmail: string;
}

export function Header({ userEmail }: HeaderProps) {
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
					<UserMenu email={userEmail} />
				</div>
			</div>
		</header>
	);
}
