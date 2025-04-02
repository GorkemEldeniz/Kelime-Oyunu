"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface HeaderProps {
	user: {
		email: string;
		username: string;
	};
	hasPlayedToday: boolean;
}

export function Header({ user, hasPlayedToday }: HeaderProps) {
	const pathname = usePathname();

	const showPlayButton = !pathname.startsWith("/game") || !hasPlayedToday;

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
					{showPlayButton && (
						<Button asChild size='lg' variant='outline'>
							<Link href='/game'>Oyna</Link>
						</Button>
					)}

					<ThemeToggle />
					<UserMenu name={user.username ?? user.email} />
				</div>
			</div>
		</header>
	);
}
