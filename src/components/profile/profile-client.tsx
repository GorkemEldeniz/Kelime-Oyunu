"use client";

import { GameRecord } from "@/types/game";
import { Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { GameHistory } from "./game-history";
import { StatsOverview } from "./stats-overview";

interface ProfileClientProps {
	gameHistory: GameRecord[];
	totalPages: number;
	currentPage: number;
}

export function ProfileClient({
	gameHistory,
	totalPages,
	currentPage,
}: ProfileClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		router.push(`/profile?${params.toString()}`);
	};

	// Calculate stats
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
		<div className='container max-w-4xl py-8'>
			<div className='flex items-center gap-3 mb-8'>
				<Trophy className='w-8 h-8 text-primary' />
				<h1 className='text-3xl font-bold'>Profiliniz</h1>
			</div>

			<StatsOverview
				totalGames={totalGames}
				averageScore={averageScore}
				bestScore={bestScore}
			/>

			<GameHistory games={gameHistory} />

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='flex justify-center gap-2 mt-8'>
					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Önceki
					</Button>
					<div className='flex items-center gap-2'>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						))}
					</div>
					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Sonraki
					</Button>
				</div>
			)}
		</div>
	);
}
