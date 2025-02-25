import { z } from "zod";

export const guessSchema = z.object({
	guess: z.string().min(1, "Tahmin boş olamaz"),
});

export const saveGameRecordSchema = z.object({
	score: z.number().min(0, "Skor sıfırdan küçük olamaz"),
	timeLeft: z.number().min(0, "Zaman sıfırdan küçük olamaz"),
	questionsCount: z.number().min(0, "Soru sayısı sıfırdan küçük olamaz"),
});

export type GuessInput = z.infer<typeof guessSchema>;
export type SaveGameRecordInput = z.infer<typeof saveGameRecordSchema>;
