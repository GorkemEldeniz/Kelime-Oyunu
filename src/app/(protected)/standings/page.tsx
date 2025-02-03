import { getAllTimeStandings, getDailyStandings } from "@/action/game";
import { StandingsClient } from "@/components/standings/standings-client";

export const revalidate = 60; // Revalidate every minute

interface StandingsPageProps {
	searchParams: Promise<{
		page?: string;
	}>;
}

async function StandingsPage(props: StandingsPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;

    const [dailyData, allTimeData] = await Promise.all([
		getDailyStandings(page),
		getAllTimeStandings(page),
	]);

    return (
		<StandingsClient
			dailyStandings={dailyData.standings}
			allTimeStandings={allTimeData.standings}
			totalPages={Math.max(dailyData.totalPages, allTimeData.totalPages)}
			currentPage={page}
		/>
	);
}

export default StandingsPage;
