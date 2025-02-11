"use client";

import { useSearchParams } from "next/navigation";
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
	const searchParams = useSearchParams();
	const page = Number(searchParams.get("page")) || 1;
	const itemsPerPage = 10;

	return (
		<div className='space-y-4'>
			{standings.map((standing, index) => (
				<StandingCard
					key={standing.userId}
					position={(page - 1) * itemsPerPage + index + 1}
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
