"use client";

import { Question } from "@/types/question";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type GameContextType = {
	index: number;
	score: number;
	totalTime: number;
	respondTime: number;
	isResponding: boolean;
	isPaused: boolean;
	questions: Question[];
	revealedIndexes: number[];
	isGameOver: boolean;
	startResponding: () => void;
	stopResponding: () => void;
	togglePause: () => void;
	revealLetter: (index: number) => void;
	nextQuestion: () => void;
	setScore: (score: number) => void;
	setIsGameOver: (isGameOver: boolean) => void;
};

export const GameContext = createContext<GameContextType>(
	{} as GameContextType
);

// Game configuration
const GAME_CONFIG = {
	TOTAL_TIME: 4 * 60 * 1000, // 4 minutes in milliseconds
	RESPOND_TIME: 30 * 1000, // 30 seconds in milliseconds
	POINT_PER_LETTER: 100, // Points per letter in the word
};

export const GameProvider = ({
	children,
	initialQuestions,
}: {
	children: React.ReactNode;
	initialQuestions: Question[];
}) => {
	// Core game state
	const [index, setIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [totalTime, setTotalTime] = useState(GAME_CONFIG.TOTAL_TIME);
	const [respondTime, setRespondTime] = useState(GAME_CONFIG.RESPOND_TIME);
	const [isResponding, setIsResponding] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [questions] = useState<Question[]>(initialQuestions);
	const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
	const [isGameOver, setIsGameOver] = useState(false);

	// Game status
	const isGameOverMemo = useMemo(() => {
		return totalTime <= 0 || isGameOver;
	}, [totalTime, isGameOver]);

	// Reset revealed indexes when index changes
	useEffect(() => {
		setRevealedIndexes([]);
		setRespondTime(GAME_CONFIG.RESPOND_TIME);
		setIsResponding(false);
		setIsPaused(false);
	}, [index]);

	// Timer logic
	useEffect(() => {
		if (isGameOverMemo) return;

		const timer = setInterval(() => {
			if (isResponding) {
				setRespondTime((prev) => {
					if (prev <= 1000) {
						setIsResponding(false);
						setIsPaused(true);
						// Reveal all letters when time is up
						const word = questions[index]?.word;
						if (word) {
							setRevealedIndexes(
								Array.from({ length: word.length }, (_, i) => i)
							);
						}
						return GAME_CONFIG.RESPOND_TIME;
					}
					return prev - 1000;
				});
			} else if (!isPaused) {
				setTotalTime((prev) => {
					const newTime = prev - 1000;
					if (newTime <= 0) {
						setIsGameOver(true);
						return 0;
					}
					return newTime;
				});
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [isGameOverMemo, isPaused, isResponding, questions, index]);

	// Game actions
	const startResponding = () => {
		if (isResponding) {
			setIsResponding(false);
		} else {
			setIsResponding(true);
			setRespondTime(GAME_CONFIG.RESPOND_TIME);
		}
	};

	const stopResponding = () => {
		setIsResponding(false);
		setRespondTime(GAME_CONFIG.RESPOND_TIME);
	};

	const togglePause = () => {
		setIsPaused((prev) => !prev);
		setIsResponding(false);
	};

	const revealLetter = (index: number) => {
		setRevealedIndexes((prev) => [...prev, index]);
	};

	const nextQuestion = () => {
		if (index < questions.length - 1) {
			setIndex((prev) => prev + 1);
			setRevealedIndexes([]);
			setRespondTime(GAME_CONFIG.RESPOND_TIME);
			setIsResponding(false);
			setIsPaused(false);
		}
		if (index === questions.length - 1) {
			setIsGameOver(true);
		}
	};

	return (
		<GameContext.Provider
			value={{
				index,
				score,
				totalTime,
				respondTime,
				isResponding,
				isPaused,
				questions,
				revealedIndexes,
				isGameOver,
				startResponding,
				stopResponding,
				togglePause,
				revealLetter,
				nextQuestion,
				setScore,
				setIsGameOver,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
};
