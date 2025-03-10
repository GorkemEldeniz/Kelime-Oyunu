"use client";

import { useSearchParams } from "next/navigation";
import { StandingCard } from "./standing-card";

interface DailyStanding {
	id: number;
	score: number;
	timeLeft: number;
	user: {
		username: string;
	};
}

interface DailyStandingsProps {
	standings: DailyStanding[];
}

export function DailyStandings({ standings }: DailyStandingsProps) {
	const searchParams = useSearchParams();
	const page = Number(searchParams.get("page")) || 1;
	const itemsPerPage = 10;

	return (
		<div className='space-y-4'>
			{standings.map((standing, index) => (
				<StandingCard
					key={standing.id}
					position={(page - 1) * itemsPerPage + index + 1}
					username={standing.user.username}
					score={standing.score}
					timeLeft={standing.timeLeft}
				/>
			))}
			{standings.length === 0 && (
				<div className='text-center text-muted-foreground py-8'>
					Bugün henüz oyun oynanmamış.
				</div>
			)}
		</div>
	);
}
