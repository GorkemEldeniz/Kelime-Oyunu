"use client";

import { useGameContext } from "@/context/game-context";
import { cn } from "@/lib/utils";

export function GameStats() {
	const { score, totalTime, respondTime, isResponding, index, questions } =
		useGameContext();

	const formatTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const stats = [
		{
			label: "Puan",
			value: score,
			color: "from-violet-500 to-purple-500",
		},
		{
			label: "Kalan Süre",
			value: formatTime(totalTime),
			color: "from-orange-500 to-amber-500",
			alert: totalTime < 60000, // Alert when less than 1 minute
		},
		{
			label: "Cevap Süresi",
			value: isResponding ? formatTime(respondTime) : "--:--",
			color: "from-red-500 to-pink-500",
			alert: isResponding && respondTime < 10000, // Alert when less than 10 seconds
		},
		{
			label: "Soru",
			value: `${index + 1}/${questions?.length ?? 0}`,
			color: "from-emerald-500 to-teal-500",
		},
	];

	return (
		<div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
			{stats.map((stat) => (
				<div
					key={stat.label}
					className={cn(
						"relative overflow-hidden rounded-lg border bg-gradient-to-br p-3",
						stat.alert && "animate-pulse border-red-500"
					)}
				>
					<div className='relative z-10'>
						<p className='text-sm font-medium text-muted-foreground'>
							{stat.label}
						</p>
						<p
							className={cn(
								"mt-1 text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
								stat.color
							)}
						>
							{stat.value}
						</p>
					</div>
					<div
						className={cn(
							"absolute inset-0 opacity-10 bg-gradient-to-br",
							stat.color
						)}
					/>
				</div>
			))}
		</div>
	);
}
