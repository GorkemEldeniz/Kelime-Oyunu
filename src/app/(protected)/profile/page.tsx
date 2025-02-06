import { getUserGameHistory } from "@/action/game";
import { ProfileClient } from "@/components/profile/profile-client";
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

	return (
		<ProfileClient
			gameHistory={games}
			totalPages={totalPages}
			currentPage={page}
		/>
	);
}
