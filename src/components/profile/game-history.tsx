"use client";

import { History } from "lucide-react";
import { GameCard } from "./game-card";

interface GameRecord {
	id: number;
	score: number;
	timeLeft: number;
	questionsCount: number;
	averageScore: number;
	playedAt: string;
}

interface GameHistoryProps {
	games: GameRecord[];
}

export function GameHistory({ games }: GameHistoryProps) {
	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-2'>
				<History className='w-5 h-5' />
				<h2 className='text-xl font-semibold'>Son Oyunlar</h2>
			</div>

			<div className='space-y-4'>
				{games.map((game) => (
					<GameCard key={game.id} {...game} />
				))}

				{games.length === 0 && (
					<div className='text-center text-muted-foreground py-8'>
						Oyun Geçmişinizde oyun bulunamadı.
					</div>
				)}
			</div>
		</div>
	);
}
