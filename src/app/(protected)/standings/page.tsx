import { getAllTimeStandings, getDailyStandings } from "@/action/game";
import { StandingsClient } from "@/components/standings/standings-client";

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
		<StandingsClient
			dailyStandings={dailyData.standings}
			allTimeStandings={allTimeData.standings}
			totalPages={
				activeTab === "daily" ? dailyData.totalPages : allTimeData.totalPages
			}
			currentPage={page}
		/>
	);
}

export default StandingsPage;
