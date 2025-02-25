import { getUserGameHistory } from "@/action/game";
import { GameHistory } from "@/components/profile/game-history";
import { ProfileStats } from "@/components/profile/profile-stats";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
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
		<div className='container max-w-4xl py-8'>
			<PageHeader title='Profiliniz' icon='Trophy' />
			<ProfileStats />
			<GameHistory games={games} />
			<Pagination
				totalPages={totalPages}
				currentPage={page}
				baseUrl='/profile'
			/>
		</div>
	);
}
