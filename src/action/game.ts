"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Check if user has played today
export async function hasPlayedToday() {
	const session = await auth();
	if (!session) return false;

	const now = new Date();
	// Create UTC date for today at 00:00:00
	const today = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
	);
	// Create UTC date for tomorrow at 00:00:00
	const tomorrow = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	);

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
export async function saveGameRecord(data: {
	score: number;
	timeLeft: number;
	questionsCount: number;
}) {
	const session = await auth();
	if (!session) return null;

	// Check if user has already played today
	const hasPlayed = await hasPlayedToday();
	if (hasPlayed) return null;

	// Create a new UTC date for the current time
	const now = new Date();
	const playedAt = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds(),
			now.getUTCMilliseconds()
		)
	);

	const record = await db.gameRecord.create({
		data: {
			userId: session.user.id,
			score: data.score,
			timeLeft: data.timeLeft,
			questionsCount: data.questionsCount,
			averageScore: data.score / data.questionsCount,
			playedAt, // Use UTC date
		},
	});

	revalidatePath("/game");
	revalidatePath("/standings");
	return record;
}

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
	const now = new Date();
	const today = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
	);
	const tomorrow = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	);

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
			orderBy: [
				{ score: "desc" },
				{ timeLeft: "desc" }, // If scores are equal, more time left wins
			],
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
			.then((result) => result.length),
	]);

	// Get usernames for the records
	const userIds = records.map((r) => r.userId);
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
		.map((record) => ({
			...record,
			username: users.find((u) => u.id === record.userId)?.username,
			_avg: {
				score: record._avg.score || 0,
				timeLeft: record._avg.timeLeft || 0,
			},
		}))
		.filter(
			(
				record
			): record is {
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
