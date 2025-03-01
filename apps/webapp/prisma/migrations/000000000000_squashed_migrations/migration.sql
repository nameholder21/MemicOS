-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserSecretType" AS ENUM ('MEMICOS', 'OPENAI', 'GOOGLE', 'ANTHROPIC', 'OPENROUTER');

-- CreateEnum
CREATE TYPE "SteerOutputType" AS ENUM ('DEFAULT', 'STEERED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSecret" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "type" "UserSecretType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT DEFAULT '',
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "githubUsername" TEXT,
    "bot" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "canTriggerExplanations" BOOLEAN NOT NULL DEFAULT false,
    "emailNewsletterNotification" BOOLEAN NOT NULL DEFAULT true,
    "emailUnsubscribeAll" BOOLEAN NOT NULL DEFAULT false,
    "emailUnsubscribeCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListComment" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultTestText" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListsOnNeurons" (
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "description" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ListsOnNeurons_pkey" PRIMARY KEY ("modelId","layer","index","listId")
);

-- CreateTable
CREATE TABLE "ListsOnActivations" (
    "activationId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ListsOnActivations_pkey" PRIMARY KEY ("activationId","listId")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "displayNameShort" TEXT NOT NULL DEFAULT '',
    "displayName" TEXT NOT NULL DEFAULT '',
    "creatorId" TEXT NOT NULL,
    "tlensId" TEXT,
    "dimension" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "inferenceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "instruct" BOOLEAN NOT NULL DEFAULT false,
    "layers" INTEGER NOT NULL,
    "neuronsPerLayer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "website" TEXT,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InferenceHostSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostUrl" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InferenceHostSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InferenceHostSourceOnSource" (
    "sourceId" TEXT NOT NULL,
    "sourceModelId" TEXT NOT NULL,
    "inferenceHostId" TEXT NOT NULL,

    CONSTRAINT "InferenceHostSourceOnSource_pkey" PRIMARY KEY ("sourceId","sourceModelId","inferenceHostId")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "hasDashboards" BOOLEAN NOT NULL DEFAULT true,
    "inferenceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "saelensConfig" JSONB,
    "saelensRelease" TEXT,
    "saelensSaeId" TEXT,
    "hfRepoId" TEXT,
    "hfFolderId" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "setName" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "hasUmap" BOOLEAN NOT NULL DEFAULT false,
    "hasUmapLogSparsity" BOOLEAN NOT NULL DEFAULT false,
    "hasUmapClusters" BOOLEAN NOT NULL DEFAULT false,
    "num_prompts" INTEGER,
    "num_tokens_in_prompt" INTEGER,
    "dataset" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SourceSet" (
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hasDashboards" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "creatorName" TEXT NOT NULL,
    "urls" TEXT[],
    "creatorEmail" TEXT,
    "creatorId" TEXT NOT NULL,
    "releaseName" TEXT,
    "defaultRange" INTEGER NOT NULL DEFAULT 1,
    "defaultShowBreaks" BOOLEAN NOT NULL DEFAULT true,
    "showDfa" BOOLEAN NOT NULL DEFAULT false,
    "showCorrelated" BOOLEAN NOT NULL DEFAULT false,
    "showHeadAttribution" BOOLEAN NOT NULL DEFAULT false,
    "showUmap" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SourceRelease" (
    "name" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "isNewUi" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "descriptionShort" TEXT,
    "urls" TEXT[],
    "creatorEmail" TEXT,
    "creatorName" TEXT NOT NULL,
    "creatorNameShort" TEXT,
    "creatorId" TEXT NOT NULL,
    "defaultSourceId" TEXT,
    "defaultUmapSourceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Eval" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "output" JSONB NOT NULL,
    "detailedMetrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Eval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalType" (
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longerDescription" TEXT NOT NULL DEFAULT '',
    "outputSchema" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvalType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Neuron" (
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "sourceSetName" TEXT,
    "creatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxActApprox" DOUBLE PRECISION DEFAULT 0,
    "hasVector" BOOLEAN NOT NULL DEFAULT false,
    "vector" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "vectorLabel" TEXT,
    "vectorDefaultSteerStrength" DOUBLE PRECISION DEFAULT 10,
    "hookName" TEXT,
    "topkCosSimIndices" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "topkCosSimValues" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "neuron_alignment_indices" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "neuron_alignment_values" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "neuron_alignment_l1" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "correlated_neurons_indices" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "correlated_neurons_pearson" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "correlated_neurons_l1" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "correlated_features_indices" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "correlated_features_pearson" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "correlated_features_l1" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "neg_str" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "neg_values" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "pos_str" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pos_values" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "frac_nonzero" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "freq_hist_data_bar_heights" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "freq_hist_data_bar_values" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "logits_hist_data_bar_heights" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "logits_hist_data_bar_values" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "decoder_weights_dist" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "umap_cluster" INTEGER,
    "umap_log_feature_sparsity" DOUBLE PRECISION,
    "umap_x" DOUBLE PRECISION,
    "umap_y" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "Explanation" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "embedding" vector(256),
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "triggeredByUserId" TEXT,
    "notes" TEXT,
    "scoreV1" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreV2" DOUBLE PRECISION,
    "umap_x" DOUBLE PRECISION DEFAULT 0,
    "umap_y" DOUBLE PRECISION DEFAULT 0,
    "umap_cluster" INTEGER DEFAULT 0,
    "umap_log_feature_sparsity" DOUBLE PRECISION DEFAULT 0,
    "typeName" TEXT,
    "explanationModelName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Explanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplanationModelSettings" (
    "id" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "maxTokens" INTEGER,
    "topP" DOUBLE PRECISION,
    "frequencyPenalty" DOUBLE PRECISION,

    CONSTRAINT "ExplanationModelSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplanationModelType" (
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "openRouterModelId" TEXT,
    "url" TEXT,
    "creatorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationModelType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ExplanationType" (
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "isAttention" BOOLEAN NOT NULL DEFAULT false,
    "explainerModelSettingsId" TEXT,
    "settings" TEXT,
    "url" TEXT,
    "creatorName" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ExplanationScore" (
    "id" TEXT NOT NULL,
    "initiatedByUserId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "explanationId" TEXT NOT NULL,
    "explanationScoreTypeName" TEXT NOT NULL,
    "explanationScoreModelName" TEXT NOT NULL,
    "jsonDetails" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplanationScoreType" (
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "isAttention" BOOLEAN NOT NULL DEFAULT false,
    "scoreDescription" TEXT,
    "scorerModel" TEXT,
    "settings" TEXT,
    "url" TEXT,
    "creatorName" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationScoreType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ExplanationScoreModel" (
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "openRouterModelId" TEXT,
    "url" TEXT,
    "creatorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationScoreModel_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ExplanationActivationV1" (
    "id" TEXT NOT NULL,
    "explanationId" TEXT NOT NULL,
    "activationId" TEXT NOT NULL,
    "expectedValues" DOUBLE PRECISION[],
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scorerId" TEXT,
    "scorerAutoInterpModel" TEXT,
    "version" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplanationActivationV1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "reason" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "explanationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activation" (
    "id" TEXT NOT NULL,
    "tokens" TEXT[],
    "dataIndex" TEXT,
    "index" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "dataSource" TEXT,
    "maxValue" DOUBLE PRECISION NOT NULL,
    "maxValueTokenIndex" INTEGER NOT NULL,
    "minValue" DOUBLE PRECISION NOT NULL,
    "values" DOUBLE PRECISION[],
    "dfaValues" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "dfaTargetIndex" INTEGER,
    "dfaMaxValue" DOUBLE PRECISION,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lossValues" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "logitContributions" TEXT,
    "binMin" DOUBLE PRECISION,
    "binMax" DOUBLE PRECISION,
    "binContains" DOUBLE PRECISION,
    "qualifyingTokenIndex" INTEGER,

    CONSTRAINT "Activation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearchTopK" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "userId" TEXT,
    "densityThreshold" DOUBLE PRECISION NOT NULL DEFAULT -1,
    "ignoreBos" BOOLEAN NOT NULL DEFAULT true,
    "numResults" INTEGER NOT NULL DEFAULT 5,
    "jsonResult" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearchTopK_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "tokens" TEXT[],
    "modelId" TEXT NOT NULL,
    "selectedLayers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortByIndexes" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "ignoreBos" BOOLEAN NOT NULL DEFAULT true,
    "sourceSet" TEXT,
    "userId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "counts" TEXT NOT NULL DEFAULT '',
    "numResults" INTEGER NOT NULL DEFAULT 50,
    "densityThreshold" DOUBLE PRECISION NOT NULL DEFAULT -1,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearchActivation" (
    "savedSearchId" TEXT NOT NULL,
    "activationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SavedSearchActivation_pkey" PRIMARY KEY ("savedSearchId","activationId","order")
);

-- CreateTable
CREATE TABLE "SteerOutputToNeuron" (
    "modelId" TEXT NOT NULL,
    "layer" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL,
    "steerOutputId" TEXT NOT NULL,

    CONSTRAINT "SteerOutputToNeuron_pkey" PRIMARY KEY ("steerOutputId","modelId","layer","index","strength")
);

-- CreateTable
CREATE TABLE "SteerOutput" (
    "id" TEXT NOT NULL,
    "type" "SteerOutputType" NOT NULL,
    "modelId" TEXT NOT NULL,
    "steerSpecialTokens" BOOLEAN NOT NULL DEFAULT false,
    "inputText" TEXT NOT NULL,
    "inputTextChatTemplate" TEXT,
    "outputText" TEXT NOT NULL,
    "outputTextChatTemplate" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "numTokens" INTEGER NOT NULL,
    "freqPenalty" DOUBLE PRECISION NOT NULL,
    "seed" DOUBLE PRECISION NOT NULL,
    "strengthMultiplier" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "connectedDefaultOutputId" TEXT,
    "connectedSteerOutputIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "SteerOutput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "value_type" ON "UserSecret"("value", "type");

-- CreateIndex
CREATE INDEX "UserSecret_username_idx" ON "UserSecret"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecret_username_type_key" ON "UserSecret"("username", "type");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_bot_idx" ON "User"("bot");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailUnsubscribeCode_key" ON "User"("emailUnsubscribeCode");

-- CreateIndex
CREATE INDEX "ListComment_listId_idx" ON "ListComment"("listId");

-- CreateIndex
CREATE INDEX "ListComment_userId_idx" ON "ListComment"("userId");

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "ListsOnNeurons_listId_idx" ON "ListsOnNeurons"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Model_visibility_idx" ON "Model"("visibility");

-- CreateIndex
CREATE INDEX "Model_creatorId_idx" ON "Model"("creatorId");

-- CreateIndex
CREATE INDEX "InferenceHostSource_modelId_idx" ON "InferenceHostSource"("modelId");

-- CreateIndex
CREATE INDEX "InferenceHostSourceOnSource_sourceModelId_idx" ON "InferenceHostSourceOnSource"("sourceModelId");

-- CreateIndex
CREATE INDEX "InferenceHostSourceOnSource_sourceModelId_sourceId_idx" ON "InferenceHostSourceOnSource"("sourceModelId", "sourceId");

-- CreateIndex
CREATE INDEX "Source_setName_idx" ON "Source"("setName");

-- CreateIndex
CREATE INDEX "Source_modelId_setName_idx" ON "Source"("modelId", "setName");

-- CreateIndex
CREATE INDEX "Source_creatorId_idx" ON "Source"("creatorId");

-- CreateIndex
CREATE INDEX "Source_visibility_idx" ON "Source"("visibility");

-- CreateIndex
CREATE UNIQUE INDEX "Source_modelId_id_key" ON "Source"("modelId", "id");

-- CreateIndex
CREATE INDEX "SourceSet_visibility_idx" ON "SourceSet"("visibility");

-- CreateIndex
CREATE INDEX "SourceSet_name_idx" ON "SourceSet"("name");

-- CreateIndex
CREATE INDEX "SourceSet_releaseName_idx" ON "SourceSet"("releaseName");

-- CreateIndex
CREATE INDEX "SourceSet_creatorId_idx" ON "SourceSet"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "SourceSet_modelId_name_key" ON "SourceSet"("modelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SourceRelease_name_key" ON "SourceRelease"("name");

-- CreateIndex
CREATE INDEX "SourceRelease_creatorId_idx" ON "SourceRelease"("creatorId");

-- CreateIndex
CREATE INDEX "SourceRelease_visibility_idx" ON "SourceRelease"("visibility");

-- CreateIndex
CREATE INDEX "SourceRelease_featured_idx" ON "SourceRelease"("featured");

-- CreateIndex
CREATE INDEX "Eval_modelId_sourceId_idx" ON "Eval"("modelId", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Eval_modelId_sourceId_typeName_key" ON "Eval"("modelId", "sourceId", "typeName");

-- CreateIndex
CREATE INDEX "Neuron_modelId_idx" ON "Neuron"("modelId");

-- CreateIndex
CREATE INDEX "Neuron_modelId_layer_idx" ON "Neuron"("modelId", "layer");

-- CreateIndex
CREATE INDEX "Neuron_maxActApprox_idx" ON "Neuron"("maxActApprox");

-- CreateIndex
CREATE INDEX "Neuron_creatorId_idx" ON "Neuron"("creatorId");

-- CreateIndex
CREATE INDEX "Neuron_creatorId_hasVector_idx" ON "Neuron"("creatorId", "hasVector");

-- CreateIndex
CREATE INDEX "Neuron_modelId_creatorId_hasVector_idx" ON "Neuron"("modelId", "creatorId", "hasVector");

-- CreateIndex
CREATE INDEX "Neuron_hasVector_idx" ON "Neuron"("hasVector");

-- CreateIndex
CREATE INDEX "Neuron_modelId_hasVector_idx" ON "Neuron"("modelId", "hasVector");

-- CreateIndex
CREATE UNIQUE INDEX "Neuron_modelId_layer_index_key" ON "Neuron"("modelId", "layer", "index");

-- CreateIndex
CREATE INDEX "Explanation_modelId_layer_index_idx" ON "Explanation"("modelId", "layer", "index");

-- CreateIndex
CREATE INDEX "Explanation_modelId_layer_idx" ON "Explanation"("modelId", "layer");

-- CreateIndex
CREATE INDEX "Explanation_modelId_idx" ON "Explanation"("modelId");

-- CreateIndex
CREATE INDEX "Explanation_authorId_idx" ON "Explanation"("authorId");

-- CreateIndex
CREATE INDEX "Explanation_triggeredByUserId_idx" ON "Explanation"("triggeredByUserId");

-- CreateIndex
CREATE INDEX "Explanation_typeName_idx" ON "Explanation"("typeName");

-- CreateIndex
CREATE INDEX "Explanation_createdAt_idx" ON "Explanation"("createdAt");

-- CreateIndex
CREATE INDEX "Explanation_explanationModelName_idx" ON "Explanation"("explanationModelName");

-- CreateIndex
CREATE INDEX "Explanation_typeName_explanationModelName_idx" ON "Explanation"("typeName", "explanationModelName");

-- CreateIndex
CREATE INDEX "Explanation_embedding_idx" ON "Explanation"("embedding");

-- CreateIndex
CREATE INDEX "idx_explanation_embedding_null" ON "Explanation"("embedding");

-- CreateIndex
CREATE INDEX "ExplanationType_creatorId_idx" ON "ExplanationType"("creatorId");

-- CreateIndex
CREATE INDEX "ExplanationScore_initiatedByUserId_idx" ON "ExplanationScore"("initiatedByUserId");

-- CreateIndex
CREATE INDEX "ExplanationScore_explanationId_idx" ON "ExplanationScore"("explanationId");

-- CreateIndex
CREATE INDEX "ExplanationScore_explanationId_explanationScoreTypeName_exp_idx" ON "ExplanationScore"("explanationId", "explanationScoreTypeName", "explanationScoreModelName");

-- CreateIndex
CREATE INDEX "ExplanationScoreType_creatorId_idx" ON "ExplanationScoreType"("creatorId");

-- CreateIndex
CREATE INDEX "ExplanationActivationV1_explanationId_idx" ON "ExplanationActivationV1"("explanationId");

-- CreateIndex
CREATE INDEX "ExplanationActivationV1_scorerId_idx" ON "ExplanationActivationV1"("scorerId");

-- CreateIndex
CREATE INDEX "ExplanationActivationV1_activationId_idx" ON "ExplanationActivationV1"("activationId");

-- CreateIndex
CREATE UNIQUE INDEX "ExplanationActivationV1_scorerId_explanationId_activationId_key" ON "ExplanationActivationV1"("scorerId", "explanationId", "activationId", "version");

-- CreateIndex
CREATE INDEX "Vote_voterId_idx" ON "Vote"("voterId");

-- CreateIndex
CREATE INDEX "Vote_explanationId_idx" ON "Vote"("explanationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_explanationId_key" ON "Vote"("voterId", "explanationId");

-- CreateIndex
CREATE INDEX "activation_model_layer_index" ON "Activation"("modelId", "layer", "index");

-- CreateIndex
CREATE INDEX "Comment_modelId_layer_index_idx" ON "Comment"("modelId", "layer", "index");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSearchTopK_modelId_source_query_numResults_densityThre_key" ON "SavedSearchTopK"("modelId", "source", "query", "numResults", "densityThreshold", "ignoreBos");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSearch_modelId_query_selectedLayers_sourceSet_sortByIn_key" ON "SavedSearch"("modelId", "query", "selectedLayers", "sourceSet", "sortByIndexes", "ignoreBos", "numResults", "densityThreshold");

-- CreateIndex
CREATE INDEX "SavedSearchActivation_activationId_idx" ON "SavedSearchActivation"("activationId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSearchActivation_savedSearchId_activationId_key" ON "SavedSearchActivation"("savedSearchId", "activationId");

-- CreateIndex
CREATE INDEX "SteerOutputToNeuron_modelId_layer_index_idx" ON "SteerOutputToNeuron"("modelId", "layer", "index");

-- CreateIndex
CREATE INDEX "steerIndex" ON "SteerOutput"("modelId", "type", "inputText", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens");

-- CreateIndex
CREATE INDEX "steerIndex2" ON "SteerOutput"("modelId", "type", "inputTextChatTemplate", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens");

-- CreateIndex
CREATE INDEX "steerIndexWithoutType" ON "SteerOutput"("modelId", "inputText", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens");

-- CreateIndex
CREATE INDEX "steerIndexWithoutType2" ON "SteerOutput"("modelId", "inputTextChatTemplate", "temperature", "numTokens", "freqPenalty", "seed", "strengthMultiplier", "version", "steerSpecialTokens");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecret" ADD CONSTRAINT "UserSecret_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListComment" ADD CONSTRAINT "ListComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListComment" ADD CONSTRAINT "ListComment_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnNeurons" ADD CONSTRAINT "ListsOnNeurons_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnNeurons" ADD CONSTRAINT "ListsOnNeurons_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnNeurons" ADD CONSTRAINT "ListsOnNeurons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnActivations" ADD CONSTRAINT "ListsOnActivations_activationId_fkey" FOREIGN KEY ("activationId") REFERENCES "Activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnActivations" ADD CONSTRAINT "ListsOnActivations_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InferenceHostSource" ADD CONSTRAINT "InferenceHostSource_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InferenceHostSourceOnSource" ADD CONSTRAINT "InferenceHostSourceOnSource_sourceId_sourceModelId_fkey" FOREIGN KEY ("sourceId", "sourceModelId") REFERENCES "Source"("id", "modelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InferenceHostSourceOnSource" ADD CONSTRAINT "InferenceHostSourceOnSource_inferenceHostId_fkey" FOREIGN KEY ("inferenceHostId") REFERENCES "InferenceHostSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_modelId_setName_fkey" FOREIGN KEY ("modelId", "setName") REFERENCES "SourceSet"("modelId", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSet" ADD CONSTRAINT "SourceSet_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSet" ADD CONSTRAINT "SourceSet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceSet" ADD CONSTRAINT "SourceSet_releaseName_fkey" FOREIGN KEY ("releaseName") REFERENCES "SourceRelease"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceRelease" ADD CONSTRAINT "SourceRelease_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "EvalType"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_modelId_sourceId_fkey" FOREIGN KEY ("modelId", "sourceId") REFERENCES "Source"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neuron" ADD CONSTRAINT "Neuron_modelId_layer_fkey" FOREIGN KEY ("modelId", "layer") REFERENCES "Source"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neuron" ADD CONSTRAINT "Neuron_modelId_sourceSetName_fkey" FOREIGN KEY ("modelId", "sourceSetName") REFERENCES "SourceSet"("modelId", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neuron" ADD CONSTRAINT "Neuron_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neuron" ADD CONSTRAINT "Neuron_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "ExplanationType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_explanationModelName_fkey" FOREIGN KEY ("explanationModelName") REFERENCES "ExplanationModelType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationType" ADD CONSTRAINT "ExplanationType_explainerModelSettingsId_fkey" FOREIGN KEY ("explainerModelSettingsId") REFERENCES "ExplanationModelSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationType" ADD CONSTRAINT "ExplanationType_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationScore" ADD CONSTRAINT "ExplanationScore_initiatedByUserId_fkey" FOREIGN KEY ("initiatedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationScore" ADD CONSTRAINT "ExplanationScore_explanationId_fkey" FOREIGN KEY ("explanationId") REFERENCES "Explanation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationScore" ADD CONSTRAINT "ExplanationScore_explanationScoreTypeName_fkey" FOREIGN KEY ("explanationScoreTypeName") REFERENCES "ExplanationScoreType"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationScore" ADD CONSTRAINT "ExplanationScore_explanationScoreModelName_fkey" FOREIGN KEY ("explanationScoreModelName") REFERENCES "ExplanationScoreModel"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationScoreType" ADD CONSTRAINT "ExplanationScoreType_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationActivationV1" ADD CONSTRAINT "ExplanationActivationV1_explanationId_fkey" FOREIGN KEY ("explanationId") REFERENCES "Explanation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationActivationV1" ADD CONSTRAINT "ExplanationActivationV1_activationId_fkey" FOREIGN KEY ("activationId") REFERENCES "Activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplanationActivationV1" ADD CONSTRAINT "ExplanationActivationV1_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_explanationId_fkey" FOREIGN KEY ("explanationId") REFERENCES "Explanation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activation" ADD CONSTRAINT "Activation_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activation" ADD CONSTRAINT "Activation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearchTopK" ADD CONSTRAINT "SavedSearchTopK_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearchTopK" ADD CONSTRAINT "SavedSearchTopK_modelId_source_fkey" FOREIGN KEY ("modelId", "source") REFERENCES "Source"("modelId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearchTopK" ADD CONSTRAINT "SavedSearchTopK_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearchActivation" ADD CONSTRAINT "SavedSearchActivation_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearchActivation" ADD CONSTRAINT "SavedSearchActivation_activationId_fkey" FOREIGN KEY ("activationId") REFERENCES "Activation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteerOutputToNeuron" ADD CONSTRAINT "SteerOutputToNeuron_steerOutputId_fkey" FOREIGN KEY ("steerOutputId") REFERENCES "SteerOutput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteerOutputToNeuron" ADD CONSTRAINT "SteerOutputToNeuron_modelId_layer_index_fkey" FOREIGN KEY ("modelId", "layer", "index") REFERENCES "Neuron"("modelId", "layer", "index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteerOutput" ADD CONSTRAINT "SteerOutput_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteerOutput" ADD CONSTRAINT "SteerOutput_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteerOutput" ADD CONSTRAINT "SteerOutput_connectedDefaultOutputId_fkey" FOREIGN KEY ("connectedDefaultOutputId") REFERENCES "SteerOutput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

