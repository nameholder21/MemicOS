-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "cosSimMatchModelId" TEXT,
ADD COLUMN     "cosSimMatchSourceId" TEXT;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_cosSimMatchSourceId_cosSimMatchModelId_fkey" FOREIGN KEY ("cosSimMatchSourceId", "cosSimMatchModelId") REFERENCES "Source"("id", "modelId") ON DELETE SET NULL ON UPDATE CASCADE;
