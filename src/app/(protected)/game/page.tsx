import { getLastGameRecord, hasPlayedToday } from "@/action/game";
import { EndGameBoard } from "@/components/game/end-game-board";
import { GameClientContent } from "@/components/game/game-client-content";
import { GameProvider } from "@/context/game-context";
import { getQuestions } from "@/helpers";

export default async function GamePage() {
	const [played, lastGameRecord] = await Promise.all([
		hasPlayedToday(),
		getLastGameRecord(),
	]);

	if (played && lastGameRecord) {
		return <EndGameBoard gameRecord={lastGameRecord} />;
	}

	const questions = getQuestions();

	return (
		<GameProvider initialQuestions={questions}>
			<GameClientContent />
		</GameProvider>
	);
}
