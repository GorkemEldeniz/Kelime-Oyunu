import { getLastGameRecord, hasPlayedToday } from "@/action/game";
import { GameClientContent } from "@/components/game/game-client-content";
import { GameProvider } from "@/context/game-context";
import { getQuestions } from "@/helpers";

export default async function GamePage() {
	const [played, lastGameRecord] = await Promise.all([
		hasPlayedToday(),
		getLastGameRecord(),
	]);

	const questions = getQuestions();

	return (
		<GameProvider initialQuestions={questions}>
			<GameClientContent hasPlayed={played} lastGameRecord={lastGameRecord} />
		</GameProvider>
	);
}
