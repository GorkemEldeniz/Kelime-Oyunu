-- CreateTable
CREATE TABLE "GameRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "timeLeft" INTEGER NOT NULL,
    "questionsCount" INTEGER NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameRecord_userId_playedAt_idx" ON "GameRecord"("userId", "playedAt");

-- CreateIndex
CREATE INDEX "GameRecord_playedAt_idx" ON "GameRecord"("playedAt");

-- CreateIndex
CREATE INDEX "GameRecord_score_timeLeft_idx" ON "GameRecord"("score", "timeLeft");

-- AddForeignKey
ALTER TABLE "GameRecord" ADD CONSTRAINT "GameRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
