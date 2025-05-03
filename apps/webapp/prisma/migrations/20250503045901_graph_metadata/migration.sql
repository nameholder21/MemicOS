-- CreateTable
CREATE TABLE "GraphMetadata" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "promptTokens" TEXT[],
    "prompt" TEXT NOT NULL,
    "titlePrefix" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraphMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphMetadataDataPutRequest" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GraphMetadataDataPutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GraphMetadata_userId_idx" ON "GraphMetadata"("userId");

-- CreateIndex
CREATE INDEX "GraphMetadata_modelId_idx" ON "GraphMetadata"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "GraphMetadata_modelId_slug_key" ON "GraphMetadata"("modelId", "slug");

-- CreateIndex
CREATE INDEX "GraphMetadataDataPutRequest_ipAddress_idx" ON "GraphMetadataDataPutRequest"("ipAddress");

-- CreateIndex
CREATE INDEX "GraphMetadataDataPutRequest_userId_idx" ON "GraphMetadataDataPutRequest"("userId");

-- AddForeignKey
ALTER TABLE "GraphMetadata" ADD CONSTRAINT "GraphMetadata_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphMetadata" ADD CONSTRAINT "GraphMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphMetadataDataPutRequest" ADD CONSTRAINT "GraphMetadataDataPutRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
