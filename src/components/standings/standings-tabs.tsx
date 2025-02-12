"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { AllTimeStandings } from "./all-time-standings";
import { DailyStandings } from "./daily-standings";

interface StandingsTabsProps {
	activeTab: string;
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
}

export function StandingsTabs({
	activeTab,
	dailyStandings,
	allTimeStandings,
}: StandingsTabsProps) {
	return (
		<Tabs defaultValue={activeTab}>
			<TabsList className='grid w-full grid-cols-2 mb-8'>
				<TabsTrigger value='daily' asChild>
					<Link href='/standings?tab=daily'>Günlük Sıralama</Link>
				</TabsTrigger>
				<TabsTrigger value='allTime' asChild>
					<Link href='/standings?tab=allTime'>Tüm Zamanlar</Link>
				</TabsTrigger>
			</TabsList>

			<TabsContent value='daily'>
				<DailyStandings standings={dailyStandings} />
			</TabsContent>

			<TabsContent value='allTime'>
				<AllTimeStandings standings={allTimeStandings} />
			</TabsContent>
		</Tabs>
	);
}
