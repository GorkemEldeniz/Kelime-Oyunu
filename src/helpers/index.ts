import { data } from "@/data";
import { Question } from "@/types/question";
function formatTime(time: number) {
	const date = new Date(time);

	const minutes =
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	const seconds =
		date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

	return `${minutes}:${seconds}`;
}

// Calculate score for current word
function calculateWordScore(wordLength: number, revealedCount: number) {
	return Math.max(0, (wordLength - revealedCount) * 100);
}

function getQuestions(): Question[] {
	const questions: Question[] = [];

	// For each word length from 4 to 10
	for (let length = 4; length <= 10; length++) {
		// Filter words of current length
		const wordsOfLength = data[`${length}`];

		// Skip if we don't have enough words of this length
		if (wordsOfLength.length < 2) continue;

		// Get 2 random words of this length
		const selectedIndexes = new Set<number>();
		while (selectedIndexes.size < 2) {
			const randomIndex = Math.floor(Math.random() * wordsOfLength.length);
			if (!selectedIndexes.has(randomIndex)) {
				selectedIndexes.add(randomIndex);
				const selectedWord = wordsOfLength[randomIndex];
				questions.push({
					word: selectedWord.word,
					mean: selectedWord.mean,
				});
			}
		}
	}

	return questions;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

// Get Google OAuth2 URL
function getGoogleOAuthURL() {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

	const options = {
		redirect_uri: REDIRECT_URI,
		client_id: GOOGLE_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};

	const qs = new URLSearchParams(options);
	return `${rootUrl}?${qs.toString()}`;
}

export { calculateWordScore, formatTime, getGoogleOAuthURL, getQuestions };
