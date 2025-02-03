"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface CTAButtonsProps {
	isAuthenticated: boolean;
}

export function CTAButtons({ isAuthenticated }: CTAButtonsProps) {
	return (
		<motion.div
			className='flex flex-col sm:flex-row gap-4 w-full justify-center'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1.2 }}
		>
			{isAuthenticated ? (
				<Button
					asChild
					size='lg'
					className='min-w-[200px] relative overflow-hidden group'
				>
					<Link href='/game'>
						<motion.span
							className='absolute inset-0 bg-primary/10'
							initial={false}
							animate={{ scale: [1, 2], opacity: [1, 0] }}
							transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
						/>
						Oyna
					</Link>
				</Button>
			) : (
				<>
					<Button
						asChild
						size='lg'
						className='min-w-[200px] relative overflow-hidden group'
					>
						<Link href='/sign-up'>
							<motion.span
								className='absolute inset-0 bg-primary/10'
								initial={false}
								animate={{ scale: [1, 2], opacity: [1, 0] }}
								transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
							/>
							Kayıt Ol
						</Link>
					</Button>
					<Button asChild variant='outline' size='lg' className='min-w-[200px]'>
						<Link href='/sign-in'>Giriş Yap</Link>
					</Button>
				</>
			)}
		</motion.div>
	);
}
