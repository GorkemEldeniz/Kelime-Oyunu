"use client";

import { formatTime } from "@/helpers";

interface StandingCardProps {
	position: number;
	username: string;
	score: number;
	timeLeft: number;
	gamesPlayed?: number;
	isAverage?: boolean;
}

export function StandingCard({
	position,
	username,
	score,
	timeLeft,
	gamesPlayed,
	isAverage = false,
}: StandingCardProps) {
	return (
		<div className='bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 flex items-center gap-4'>
			<div className='text-2xl font-bold text-primary w-8'>#{position}</div>
			<div className='flex-1'>
				<div className='font-semibold'>{username}</div>
				<div className='text-sm text-muted-foreground'>
					{isAverage ? (
						<>
							Ort. Puan: {Math.round(score)} • Oyun: {gamesPlayed} • Ort. Kalan
							Süre: {formatTime(timeLeft)}
						</>
					) : (
						<>
							Puan: {score} • Kalan Süre: {formatTime(timeLeft)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
