"use client";

import { getUserStatsAction } from "@/action/game";
import { Card } from "@/components/ui/card";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export function ProfileStats() {
	const [totalGames, setTotalGames] = useState(0);
	const [averageScore, setAverageScore] = useState(0);
	const [highestScore, setHighestScore] = useState(0);

	const { execute: getUserStats } = useAction(getUserStatsAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setTotalGames(data?.data?.totalGames as number);
				setAverageScore(data?.data?.averageScore as number);
				setHighestScore(data?.data?.highestScore as number);
			}
		},
	});

	useEffect(() => {
		getUserStats();
	}, [getUserStats]);

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
				<div className='text-2xl font-bold'>{highestScore}</div>
			</Card>
		</div>
	);
}
