import { z } from "zod";

export const saveGameRecordSchema = z.object({
	score: z.number(),
	timeLeft: z.number(),
	questionsCount: z.number(),
});
