"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/helpers";
import { cn } from "@/lib/utils";
import { GameRecord } from "@/types/game";
import { motion } from "framer-motion";
import { Brain, Star, Timer, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface EndGameBoardProps {
	gameRecord?: GameRecord;
}

export function EndGameBoard({ gameRecord }: EndGameBoardProps) {
	const router = useRouter();
	// Calculate average score per question
	const avgScorePerQuestion =
		gameRecord?.score && gameRecord?.questionsCount
			? Math.round(gameRecord.score / gameRecord.questionsCount)
			: 0;

	const stats = [
		{
			label: "Toplam Puan",
			value: gameRecord?.score || 0,
			icon: Trophy,
			color: "from-violet-500 to-purple-500",
		},
		{
			label: "Kalan Süre",
			value: formatTime(gameRecord?.timeLeft || 0),
			icon: Timer,
			color: "from-orange-500 to-amber-500",
		},
		{
			label: "Soru Başına Puan",
			value: avgScorePerQuestion,
			icon: Star,
			color: "from-yellow-500 to-amber-500",
		},
		{
			label: "Toplam Soru",
			value: gameRecord?.questionsCount || 0,
			icon: Brain,
			color: "from-emerald-500 to-teal-500",
		},
	];

	return (
		<div className='container max-w-lg mx-auto h-full flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className='w-full space-y-8'
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-center space-y-2'
				>
					<h2 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
						Oyun Bitti!
					</h2>
					<p className='text-muted-foreground'>
						Harika bir performans gösterdin! İşte sonuçların:
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='grid grid-cols-1 sm:grid-cols-2 gap-4'
				>
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 + index * 0.1 }}
							className='relative overflow-hidden rounded-lg border bg-card p-4'
						>
							<div className='flex items-center gap-4'>
								<div
									className={cn("p-2 rounded-md bg-gradient-to-br", stat.color)}
								>
									<stat.icon className='w-5 h-5 text-white' />
								</div>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										{stat.label}
									</p>
									<p
										className={cn(
											"text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
											stat.color
										)}
									>
										{stat.value}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className='flex gap-4 justify-center'
				>
					<Button
						variant='outline'
						size='lg'
						className='relative overflow-hidden group'
						onClick={() => router.push("/standings")}
					>
						<span className='relative z-10'>Sıralama</span>
						<div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
}
