"use client";

import { StandingCard } from "./standing-card";

interface Standing {
	userId: number;
	username: string;
	_avg: {
		score: number;
		timeLeft: number;
	};
	_count: {
		score: number;
	};
}

interface AllTimeStandingsProps {
	standings: Standing[];
}

export function AllTimeStandings({ standings }: AllTimeStandingsProps) {
	return (
		<div className='space-y-4'>
			{standings.map((standing, index) => (
				<StandingCard
					key={standing.userId}
					position={index + 1}
					username={standing.username}
					score={standing._avg.score}
					timeLeft={standing._avg.timeLeft}
					gamesPlayed={standing._count.score}
					isAverage
				/>
			))}
			{standings.length === 0 && (
				<div className='text-center text-muted-foreground py-8'>
					Henüz oyun oynanmamış.
				</div>
			)}
		</div>
	);
}
