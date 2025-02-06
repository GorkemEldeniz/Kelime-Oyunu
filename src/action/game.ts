"use server";

import { getTurkishDayBoundaries } from "@/helpers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { saveGameRecordSchema } from "@/lib/validations/game";
import { revalidatePath } from "next/cache";

// Check if user has played within allowed time range (12:00-15:00 Turkish time)
export async function hasPlayedToday() {
	const session = await auth();
	if (!session) return false;

	const { today, tomorrow } = getTurkishDayBoundaries();

	// Check if user has played within the current time range
	const record = await db.gameRecord.findFirst({
		where: {
			userId: session.user.id,
			playedAt: {
				gte: today,
				lt: tomorrow,
			},
		},
	});

	return !!record;
}

// Get user's last game record
export async function getLastGameRecord() {
	const session = await auth();
	if (!session) return null;

	const record = await db.gameRecord.findFirst({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			playedAt: "desc",
		},
	});

	if (!record) return null;

	return {
		...record,
		playedAt: record.playedAt.toISOString(),
	};
}

// Save game record
export const saveGameRecord = actionClient
	.schema(saveGameRecordSchema)
	.action(async ({ parsedInput: { score, timeLeft, questionsCount } }) => {
		const session = await auth();
		if (!session) return null;

		// Check if user has already played today
		const hasPlayed = await hasPlayedToday();
		if (hasPlayed) return null;

		const record = await db.gameRecord.create({
			data: {
				userId: session.user.id,
				score,
				timeLeft,
				questionsCount,
				averageScore: score / questionsCount,
			},
		});

		revalidatePath("/game");
		revalidatePath("/standings");
		return record;
	});

// Get user's game history
export async function getUserGameHistory(page = 1) {
	const session = await auth();
	if (!session) return { games: [], totalPages: 0 };

	const itemsPerPage = 10;
	const skip = (page - 1) * itemsPerPage;

	const [games, total] = await Promise.all([
		db.gameRecord.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				playedAt: "desc",
			},
			take: itemsPerPage,
			skip,
		}),
		db.gameRecord.count({
			where: {
				userId: session.user.id,
			},
		}),
	]);

	const totalPages = Math.ceil(total / itemsPerPage);

	return {
		games,
		totalPages,
	};
}

// Get daily standings
export async function getDailyStandings(page = 1) {
	const { today, tomorrow } = getTurkishDayBoundaries();

	const itemsPerPage = 10;
	const skip = (page - 1) * itemsPerPage;

	const [standings, total] = await Promise.all([
		db.gameRecord.findMany({
			where: {
				playedAt: {
					gte: today,
					lt: tomorrow,
				},
			},
			include: {
				user: {
					select: {
						username: true,
					},
				},
			},
			orderBy: [{ score: "desc" }, { timeLeft: "desc" }],
			take: itemsPerPage,
			skip,
		}),
		db.gameRecord.count({
			where: {
				playedAt: {
					gte: today,
					lt: tomorrow,
				},
			},
		}),
	]);

	const totalPages = Math.ceil(total / itemsPerPage);

	return {
		standings,
		totalPages,
	};
}

// Get all-time standings
export async function getAllTimeStandings(page = 1) {
	const itemsPerPage = 10;
	const skip = (page - 1) * itemsPerPage;

	const [records, total] = await Promise.all([
		db.gameRecord.groupBy({
			by: ["userId"],
			_avg: {
				score: true,
				timeLeft: true,
			},
			_count: {
				score: true,
			},
			orderBy: [
				{
					_avg: {
						score: "desc",
					},
				},
				{
					_avg: {
						timeLeft: "desc",
					},
				},
			],
			take: itemsPerPage,
			skip,
		}),
		db.gameRecord
			.groupBy({
				by: ["userId"],
				_count: {
					userId: true,
				},
			})
			.then((result: { length: number }) => result.length),
	]);

	// Get usernames for the records
	interface GameRecord {
		userId: number;
		_avg: {
			score: number | null;
			timeLeft: number | null;
		};
		_count: {
			score: number;
		};
	}

	interface User {
		id: number;
		username: string;
	}

	const userIds = records.map((record: GameRecord) => record.userId);
	const users = await db.user.findMany({
		where: {
			id: {
				in: userIds,
			},
		},
		select: {
			id: true,
			username: true,
		},
	});

	// Combine records with usernames and filter out records without usernames
	const standings = records
		.map((record: GameRecord) => ({
			...record,
			username: users.find((user: User) => user.id === record.userId)?.username,
			_avg: {
				score: record._avg.score || 0,
				timeLeft: record._avg.timeLeft || 0,
			},
		}))
		.filter(
			(record: {
				userId: number;
				username: string | undefined;
				_avg: { score: number; timeLeft: number };
				_count: { score: number };
			}): record is {
				userId: number;
				username: string;
				_avg: { score: number; timeLeft: number };
				_count: { score: number };
			} => record.username !== undefined
		);

	const totalPages = Math.ceil(total / itemsPerPage);

	return {
		standings,
		totalPages,
	};
}
