"use client";

import { saveGameRecord } from "@/action/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/context/game-context";
import { calculateWordScore } from "@/helpers";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface InputSectionProps {
	word: string;
	revealedIndexes: number[];
	onRevealLetter: (index: number) => void;
	isLastQuestion: boolean;
}

export function InputSection({
	word,
	revealedIndexes,
	onRevealLetter,
	isLastQuestion,
}: InputSectionProps) {
	const [input, setInput] = useState("");
	const {
		nextQuestion,
		isResponding,
		isPaused,
		startResponding,
		togglePause,
		stopResponding,
		setScore,
		score,
		totalTime,
		questions,
	} = useGameContext();
	const [isError, setIsError] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { execute: executeSaveGameRecord, status: saveGameRecordStatus } =
		useAction(saveGameRecord, {
			onSuccess: () => {
				toast.success("Oyun kaydedildi");
			},
			onError: (error) => {
				toast.error(
					error.error.serverError || "Oyun kaydedilirken bir hata oluştu"
				);
			},
		});

	// Focus input when starting to respond
	useEffect(() => {
		if (isResponding && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isResponding]);

	// Check answer on input change
	useEffect(() => {
		if (
			isResponding &&
			input.toLocaleLowerCase("tr").trim() === word.toLocaleLowerCase("tr")
		) {
			// Calculate new score first
			const scoreIncrement = calculateWordScore(
				word.length,
				revealedIndexes.length
			);
			const newScore = score + scoreIncrement;

			// Stop responding before state updates
			stopResponding();

			// Update score
			setScore(newScore);
			// Reveal all letters and pause the game
			word.split("").forEach((_, index) => {
				if (!revealedIndexes.includes(index)) {
					onRevealLetter(index);
				}
			});
			setInput("");
			setIsError(false);
			togglePause(); // Then pause the game to show next button
		}
	}, [
		word,
		onRevealLetter,
		revealedIndexes,
		isLastQuestion,
		input,
		isResponding,
	]);

	const handleNextQuestion = () => {
		setInput(""); // Clear input before moving to next question
		nextQuestion();
		if (isLastQuestion) {
			executeSaveGameRecord({
				score,
				timeLeft: totalTime,
				questionsCount: questions.length,
			});
		}
	};

	const handleRevealLetter = () => {
		const hiddenIndexes = word
			.split("")
			.map((_, i) => i)
			.filter((i) => !revealedIndexes.includes(i));

		// Only allow revealing if more than one letter remains hidden
		if (hiddenIndexes.length > 1) {
			const randomIndex =
				hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
			onRevealLetter(randomIndex);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className='w-full'
		>
			<form className='space-y-4'>
				<div className='relative'>
					<motion.div
						animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
						transition={{ duration: 0.4 }}
					>
						<Input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Cevabınızı yazın...'
							className='h-14 text-xl text-center'
							autoComplete='off'
							autoCapitalize='off'
							disabled={!isResponding}
						/>
					</motion.div>
				</div>

				<div className='flex flex-col items-center gap-3'>
					<div className='flex justify-center gap-3'>
						{isPaused ? (
							<Button
								disabled={saveGameRecordStatus === "executing"}
								type='button'
								size='lg'
								onClick={handleNextQuestion}
								className='w-20 sm:w-24 md:w-28'
							>
								{saveGameRecordStatus === "executing" ? (
									<Loader className='h-4 w-4 animate-spin' />
								) : isLastQuestion ? (
									"Bitir"
								) : (
									"Sonraki"
								)}
							</Button>
						) : (
							<Button
								type='button'
								size='lg'
								variant='destructive'
								className='w-16 h-16 rounded-full p-0'
								onClick={() => startResponding()}
								disabled={isResponding}
							/>
						)}
					</div>

					{!isResponding && !isPaused && (
						<Button
							type='button'
							variant='outline'
							size='lg'
							className='h-12'
							onClick={handleRevealLetter}
							disabled={revealedIndexes.length >= word.length - 1}
						>
							Harf Al
						</Button>
					)}
				</div>
			</form>
		</motion.div>
	);
}
