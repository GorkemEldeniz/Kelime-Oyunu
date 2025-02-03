"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface WordDisplayProps {
	hiddenWord: string[];
	mean: string;
}

export function WordDisplay({ hiddenWord, mean }: WordDisplayProps) {
	return (
		<div className='w-full space-y-4'>
			{/* Word Display */}
			<div className='relative p-2 sm:p-4 rounded-lg border bg-card/50'>
				{/* Letters Grid */}
				<div className='relative w-full max-w-full overflow-x-auto scrollbar-none'>
					<div className='flex sm:gap-2 justify-center min-w-full pb-1'>
						{hiddenWord.map((letter, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									delay: index * 0.1,
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									"size-8 sm:size-12 flex items-center justify-center rounded-md border-2 text-lg sm:text-2xl font-bold uppercase shrink-0",
									letter === " "
										? "bg-background/30 border-primary/20"
										: "bg-background/50 border-primary/40"
								)}
							>
								{letter}
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* Meaning Card */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='relative p-3 sm:p-4 rounded-lg border bg-card/50'
			>
				<div className='relative'>
					<h3 className='text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5 sm:gap-2'>
						<Star className='w-4 h-4 sm:w-5 sm:h-5' />
						Anlamı
					</h3>
					<p className='text-base sm:text-lg font-medium'>{mean}</p>
				</div>
			</motion.div>
		</div>
	);
}
