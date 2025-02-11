"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { AllTimeStandings } from "./all-time-standings";
import { DailyStandings } from "./daily-standings";

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
}

export function StandingsClient({
	dailyStandings,
	allTimeStandings,
	totalPages,
	currentPage,
}: StandingsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "daily";

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		params.set("tab", activeTab);
		router.push(`/standings?${params.toString()}`);
	};

	const handleTabChange = (tab: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("tab", tab);
		params.set("page", "1"); // Reset page when changing tabs
		router.push(`/standings?${params.toString()}`);
	};

	return (
		<div className='container max-w-4xl py-8'>
			<div className='flex items-center gap-3 mb-8'>
				<Trophy className='w-8 h-8 text-primary' />
				<h1 className='text-3xl font-bold'>Sıralama</h1>
			</div>

			<Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
				<TabsList className='grid w-full grid-cols-2 mb-8'>
					<TabsTrigger value='daily'>Günlük Sıralama</TabsTrigger>
					<TabsTrigger value='allTime'>Tüm Zamanlar</TabsTrigger>
				</TabsList>

				<TabsContent value='daily'>
					<DailyStandings standings={dailyStandings} />
				</TabsContent>

				<TabsContent value='allTime'>
					<AllTimeStandings standings={allTimeStandings} />
				</TabsContent>
			</Tabs>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='flex justify-center gap-2 mt-8'>
					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Önceki
					</Button>
					<div className='flex items-center gap-2'>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						))}
					</div>
					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Sonraki
					</Button>
				</div>
			)}
		</div>
	);
}
