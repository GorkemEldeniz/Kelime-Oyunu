"use client";

import { Card } from "@/components/ui/card";
import { GameRecord } from "@/types/game";

interface ProfileStatsProps {
	gameHistory: GameRecord[];
}

export function ProfileStats({ gameHistory }: ProfileStatsProps) {
	const totalGames = gameHistory.length;
	const averageScore = totalGames
		? Math.round(
				gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGames
		  )
		: 0;
	const bestScore = totalGames
		? Math.max(...gameHistory.map((game) => game.score))
		: 0;

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
			<Card className='p-4 bg-card/50 backdrop-blur-sm'>
				<div className='text-sm text-muted-foreground'>Toplam Oyun</div>
				<div className='text-2xl font-bold'>{totalGames}</div>
			</Card>
			<Card className='p-4 bg-card/50 backdrop-blur-sm'>
				<div className='text-sm text-muted-foreground'>Ortalama Puan</div>
				<div className='text-2xl font-bold'>{averageScore}</div>
			</Card>
			<Card className='p-4 bg-card/50 backdrop-blur-sm'>
				<div className='text-sm text-muted-foreground'>En Yüksek Puan</div>
				<div className='text-2xl font-bold'>{bestScore}</div>
			</Card>
		</div>
	);
}
