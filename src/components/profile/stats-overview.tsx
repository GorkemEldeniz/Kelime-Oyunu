"use client";

import { Card } from "@/components/ui/card";

interface StatsOverviewProps {
	totalGames: number;
	averageScore: number;
	bestScore: number;
}

export function StatsOverview({
	totalGames,
	averageScore,
	bestScore,
}: StatsOverviewProps) {
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
