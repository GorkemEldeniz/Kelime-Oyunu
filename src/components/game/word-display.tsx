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
			<div className='relative p-2 sm:p-4 rounded-lg border shadow-sm bg-card/50'>
				{/* Letters Grid */}
				<div className='relative w-full'>
					<div className='grid grid-flow-col auto-cols-fr gap-1.5 sm:gap-3 max-w-[calc(100vw-2rem)] mx-auto'>
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
									"aspect-square flex items-center justify-center rounded-md border-2 text-xl sm:text-3xl font-bold uppercase shadow-sm",
									letter === " "
										? "bg-background/80 border-primary/30"
										: "bg-background border-primary/50"
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
				className='relative p-3 sm:p-4 rounded-lg border shadow-sm bg-card/50'
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
