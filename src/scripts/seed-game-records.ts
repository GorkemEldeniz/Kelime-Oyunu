const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Mock user IDs - replace these with actual user IDs from your database
const testUserId = 2;

// Generate a random date within the last 30 days in UTC
function getRandomDate() {
	const now = new Date();
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const randomTime =
		thirtyDaysAgo.getTime() +
		Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
	const randomDate = new Date(randomTime);

	return new Date(
		Date.UTC(
			randomDate.getUTCFullYear(),
			randomDate.getUTCMonth(),
			randomDate.getUTCDate(),
			randomDate.getUTCHours(),
			randomDate.getUTCMinutes(),
			randomDate.getUTCSeconds()
		)
	);
}

// Generate random game data
function generateGameData() {
	const questionsCount = Math.floor(Math.random() * 5) + 5; // 5-10 questions
	const score = Math.floor(Math.random() * 500) + 500; // 500-1000 score
	const timeLeft = Math.floor(Math.random() * 180) + 60; // 60-240 seconds left

	return {
		questionsCount,
		score,
		timeLeft,
		averageScore: score / questionsCount,
	};
}

async function main() {
	// First, let's clean up existing records
	await prisma.gameRecord.deleteMany({});

	// Generate 30 random game records
	const gameRecords = [];
	for (let i = 0; i < 30; i++) {
		const userId = testUserId;
		const { questionsCount, score, timeLeft, averageScore } =
			generateGameData();
		const playedAt = getRandomDate();

		gameRecords.push({
			userId,
			questionsCount,
			score,
			timeLeft,
			averageScore,
			playedAt,
		});
	}

	// Insert all records
	for (const record of gameRecords) {
		await prisma.gameRecord.create({
			data: record,
		});
	}

	console.log(`✅ Successfully seeded ${gameRecords.length} game records`);
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
