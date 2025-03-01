/*
  Warnings:

  - You are about to drop the `SavedSearchTopK` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedSearchTopK" DROP CONSTRAINT "SavedSearchTopK_modelId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSearchTopK" DROP CONSTRAINT "SavedSearchTopK_modelId_source_fkey";

-- DropForeignKey
ALTER TABLE "SavedSearchTopK" DROP CONSTRAINT "SavedSearchTopK_userId_fkey";

-- DropTable
DROP TABLE "SavedSearchTopK";
