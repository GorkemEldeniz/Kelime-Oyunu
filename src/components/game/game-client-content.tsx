"use client";

import { GameStats } from "@/components/game/game-stats";
import { InputSection } from "@/components/game/input-section";
import { WordDisplay } from "@/components/game/word-display";
import { useGameContext } from "@/context/game-context";

export function GameClientContent() {
	const { index, questions, revealedIndexes, revealLetter } = useGameContext();

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
