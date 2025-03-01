-- DropIndex
DROP INDEX "steerIndex";

-- DropIndex
DROP INDEX "steerIndex2";

-- DropIndex
DROP INDEX "steerIndexWithoutType";

-- DropIndex
DROP INDEX "steerIndexWithoutType2";

-- AlterTable
ALTER TABLE "SteerOutput" ADD COLUMN     "steerMethod" TEXT NOT NULL DEFAULT 'SIMPLE_ADDITIVE';

-- CreateIndex
CREATE INDEX "steerIndex" ON "SteerOutput"("modelId", "type", "inputText", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens", "steerMethod");

-- CreateIndex
CREATE INDEX "steerIndex2" ON "SteerOutput"("modelId", "type", "inputTextChatTemplate", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens", "steerMethod");

-- CreateIndex
CREATE INDEX "steerIndexWithoutType" ON "SteerOutput"("modelId", "inputText", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens", "steerMethod");

-- CreateIndex
CREATE INDEX "steerIndexWithoutType2" ON "SteerOutput"("modelId", "inputTextChatTemplate", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens", "steerMethod");
