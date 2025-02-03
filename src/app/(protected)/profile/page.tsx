import { getUserGameHistory } from "@/action/game";
import { ProfileClient } from "@/components/profile/profile-client";
import type { GameRecord } from "@/types/game";
export const revalidate = 60; // Revalidate every minute

interface ProfilePageProps {
	searchParams: Promise<{
		page?: string;
	}>;
}

export default async function ProfilePage(props: ProfilePageProps) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const { games, totalPages } = await getUserGameHistory(page);

	// Convert Date objects to ISO strings
	const formattedHistory = games.map((game: GameRecord) => ({
		...game,
		playedAt: game.playedAt.toISOString(),
	}));

	return (
		<ProfileClient
			gameHistory={formattedHistory}
			totalPages={totalPages}
			currentPage={page}
		/>
	);
}
