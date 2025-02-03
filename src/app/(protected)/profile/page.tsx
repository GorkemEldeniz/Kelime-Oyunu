import { getUserGameHistory } from "@/action/game";
import { ProfileClient } from "@/components/profile/profile-client";

export const revalidate = 60; // Revalidate every minute

async function ProfilePage({
	searchParams,
}: {
	searchParams: { page: string };
}) {
	const { page } = searchParams;
	const { games, totalPages } = await getUserGameHistory(Number(page) || 1);

	// Convert Date objects to ISO strings
	const formattedHistory = games.map((game) => ({
		...game,
		playedAt: game.playedAt.toISOString(),
	}));

	return (
		<ProfileClient
			gameHistory={formattedHistory}
			totalPages={totalPages}
			currentPage={Number(page)}
		/>
	);
}

export default ProfilePage;
