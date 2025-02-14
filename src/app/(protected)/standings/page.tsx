import { getAllTimeStandings, getDailyStandings } from "@/action/game";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StandingsTabs } from "@/components/standings/standings-tabs";

export const revalidate = 60; // Revalidate every minute

interface StandingsPageProps {
	searchParams: Promise<{
		page?: string;
		tab?: string;
	}>;
}

async function StandingsPage(props: StandingsPageProps) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const activeTab = searchParams.tab || "daily";

	const [dailyData, allTimeData] = await Promise.all([
		getDailyStandings(activeTab === "daily" ? page : 1),
		getAllTimeStandings(activeTab === "allTime" ? page : 1),
	]);

	return (
		<div className='container max-w-4xl py-8'>
			<PageHeader title='Sıralama' icon='Trophy' />
			<StandingsTabs
				activeTab={activeTab}
				dailyStandings={dailyData.standings}
				allTimeStandings={allTimeData.standings}
			/>
			<Pagination
				totalPages={
					activeTab === "daily" ? dailyData.totalPages : allTimeData.totalPages
				}
				currentPage={page}
				baseUrl='/standings'
			/>
		</div>
	);
}

export default StandingsPage;
