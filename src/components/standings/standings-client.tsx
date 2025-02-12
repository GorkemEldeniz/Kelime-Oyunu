"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { Trophy } from "lucide-react";
import { StandingsTabs } from "./standings-tabs";

interface StandingsClientProps {
	dailyStandings: Array<{
		id: number;
		score: number;
		timeLeft: number;
		user: {
			username: string;
		};
	}>;
	allTimeStandings: Array<{
		userId: number;
		username: string;
		_avg: {
			score: number;
			timeLeft: number;
		};
		_count: {
			score: number;
		};
	}>;
	totalPages: number;
	currentPage: number;
	activeTab: string;
}

export function StandingsClient({
	dailyStandings,
	allTimeStandings,
	totalPages,
	currentPage,
	activeTab,
}: StandingsClientProps) {
	return (
		<div className='container max-w-4xl py-8'>
			<PageHeader title='Sıralama' icon={Trophy} />
			<StandingsTabs
				activeTab={activeTab}
				dailyStandings={dailyStandings}
				allTimeStandings={allTimeStandings}
			/>
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				baseUrl='/standings'
			/>
		</div>
	);
}
