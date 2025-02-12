"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { GameRecord } from "@/types/game";
import { Trophy } from "lucide-react";
import { GameHistory } from "./game-history";
import { ProfileStats } from "./profile-stats";

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
	return (
		<div className='container max-w-4xl py-8'>
			<PageHeader title='Profiliniz' icon={Trophy} />
			<ProfileStats gameHistory={gameHistory} />
			<GameHistory games={gameHistory} />
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				baseUrl='/profile'
			/>
		</div>
	);
}
