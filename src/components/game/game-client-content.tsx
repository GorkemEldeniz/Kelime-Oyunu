"use client";

import { saveGameRecord } from "@/action/game";
import { EndGameBoard } from "@/components/game/end-game-board";
import { GameStats } from "@/components/game/game-stats";
import { InputSection } from "@/components/game/input-section";
import { WordDisplay } from "@/components/game/word-display";
import { useGameContext } from "@/context/game-context";
import { GameRecord } from "@/types/game";
import { useEffect } from "react";

interface GameClientContentProps {
	hasPlayed: boolean;
	lastGameRecord: GameRecord | null;
}

export function GameClientContent({
	hasPlayed,
	lastGameRecord,
}: GameClientContentProps) {
	const {
		index,
		score,
		totalTime,
		questions,
		revealedIndexes,
		isGameOver,
		revealLetter,
	} = useGameContext();

	// Save game record when game is over
	useEffect(() => {
		const saveGame = async () => {
			if (isGameOver && questions && questions.length > 0) {
				try {
					await saveGameRecord({
						score,
						timeLeft: totalTime,
						questionsCount: questions.length,
					});
				} catch (error) {
					console.error("Error saving game record:", error);
				}
			}
		};

		saveGame();
	}, [isGameOver, score, totalTime, questions]);

	if (hasPlayed && lastGameRecord) {
		return <EndGameBoard gameRecord={lastGameRecord} />;
	}

	if (isGameOver) {
		return <EndGameBoard />;
	}

	const { word, mean } = questions[index];

	const hiddenWord = word
		.split("")
		.map((letter: string, idx: number) =>
			revealedIndexes.includes(idx) ? letter : " "
		);

	return (
		<div className='h-[calc(100vh-4rem)] flex flex-col p-4'>
			<section className='w-full max-w-2xl mx-auto'>
				<GameStats />
			</section>

			<section className='w-full max-w-2xl mx-auto space-y-4 md:flex-1 flex flex-col justify-center min-h-0 py-4'>
				<WordDisplay hiddenWord={hiddenWord} mean={mean} />
			</section>

			<section className='w-full max-w-2xl mx-auto'>
				<InputSection
					word={word}
					revealedIndexes={revealedIndexes}
					onRevealLetter={revealLetter}
					isLastQuestion={index === questions.length - 1}
				/>
			</section>
		</div>
	);
}
