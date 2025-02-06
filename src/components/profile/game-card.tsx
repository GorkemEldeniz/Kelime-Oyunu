"use client";

import { Card } from "@/components/ui/card";
import { formatTime } from "@/helpers";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

interface GameCardProps {
	id: number;
	score: number;
	timeLeft: number;
	questionsCount: number;
	averageScore: number;
	playedAt: string;
}

export function GameCard({
	score,
	timeLeft,
	questionsCount,
	averageScore,
	playedAt,
}: GameCardProps) {
	return (
		<Card className='p-4 bg-card/50 backdrop-blur-sm border border-primary/10'>
			<div className='flex justify-between items-start'>
				<div>
					<div className='font-semibold'>Score: {score}</div>
					<div className='text-sm text-muted-foreground'>
						Questions: {questionsCount} • Average: {Math.round(averageScore)} •
						Time Left: {formatTime(timeLeft)}
					</div>
				</div>
				<div className='text-sm text-muted-foreground'>
					{format(parseISO(playedAt), "d MMMM yyyy", { locale: tr })}
				</div>
			</div>
		</Card>
	);
}
