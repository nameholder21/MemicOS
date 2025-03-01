/*
  Warnings:

  - A unique constraint covering the columns `[defaultSourceSetName,id]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[defaultSourceId,id]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "defaultSourceId" TEXT,
ADD COLUMN     "defaultSourceSetName" TEXT;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "defaultOfModelId" TEXT;

-- AlterTable
ALTER TABLE "SourceSet" ADD COLUMN     "defaultOfModelId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Model_defaultSourceSetName_id_key" ON "Model"("defaultSourceSetName", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Model_defaultSourceId_id_key" ON "Model"("defaultSourceId", "id");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_defaultSourceSetName_id_fkey" FOREIGN KEY ("defaultSourceSetName", "id") REFERENCES "SourceSet"("name", "modelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_defaultSourceId_id_fkey" FOREIGN KEY ("defaultSourceId", "id") REFERENCES "Source"("id", "modelId") ON DELETE CASCADE ON UPDATE CASCADE;
