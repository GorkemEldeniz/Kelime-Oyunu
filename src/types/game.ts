import { Question } from "./question";

export type GameSession = {
	id: string;
	startedAt: number;
	lastUpdatedAt: number;
	state: {
		questions: Question[];
		currentIndex: number;
		score: number;
		totalTimeLeft: number;
		respondTimeLeft: number;
		isUserResponding: boolean;
		isGamePaused: boolean;
		revealedLetters: Record<number, number[]>;
	};
	isGameOver: boolean;
};

export type GameState = GameSession["state"];

export const INITIAL_GAME_STATE: GameState = {
	questions: [],
	currentIndex: 0,
	score: 0,
	totalTimeLeft: 3 * 60 * 1000, // 3 minutes
	respondTimeLeft: 30 * 1000, // 30 seconds
	isUserResponding: false,
	isGamePaused: false,
	revealedLetters: {},
};

export interface GameRecord {
	id: number;
	userId: number;
	score: number;
	timeLeft: number;
	questionsCount: number;
	averageScore: number;
	playedAt: Date | string;
}
