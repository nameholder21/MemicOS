import { CLTGraph, makeGraphPublicAccessGraphUrl, NP_GRAPH_BUCKET } from '@/app/[modelId]/graph/utils';
import { prisma } from '@/lib/db';
import {
  generateGraph,
  GRAPH_MAX_TOKENS,
  GRAPH_S3_USER_GRAPHS_DIR,
  graphGenerateSchemaClient,
} from '@/lib/utils/graph';
import { tokenizeText } from '@/lib/utils/inference';
import { RequestAuthedUser, withAuthedUser } from '@/lib/with-user';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

export const POST = withAuthedUser(async (request: RequestAuthedUser) => {
  try {
    let body = '';
    try {
      body = await request.json();
    } catch {
      throw new Error('Invalid JSON body');
    }
    const validatedData = await graphGenerateSchemaClient.validate(body);
    const tokenized = await tokenizeText(validatedData.modelId, validatedData.prompt, false);

    if (tokenized.tokens.length > GRAPH_MAX_TOKENS) {
      return NextResponse.json(
        {
          error: 'Prompt Too Long',
          message: `Max tokens supported is ${GRAPH_MAX_TOKENS}, your prompt was ${tokenized.tokens.length} tokens.`,
        },
        { status: 400 },
      );
    }

    console.log(`Tokens in text: ${tokenized.tokens.length} - ${tokenized.tokenStrings}`);

    // if scan or slug has weird characters, return error
    if (/[^a-zA-Z0-9_-]/.test(validatedData.slug)) {
      return NextResponse.json(
        { error: 'Invalid scan or slug. They must be alphanumeric and contain only underscores and hyphens.' },
        { status: 400 },
      );
    }

    // check if the modelId/slug exist in the database already
    const existingGraphMetadata = await prisma.graphMetadata.findUnique({
      where: { modelId_slug: { modelId: validatedData.modelId, slug: validatedData.slug } },
    });

    if (existingGraphMetadata) {
      return NextResponse.json({
        error: 'Model + Slug Name Exists',
        message: `The model ${validatedData.modelId} already has a graph with slug/id ${validatedData.slug}. Please choose a different name.`,
      });
    }

    const data = await generateGraph(
      validatedData.prompt,
      validatedData.modelId,
      validatedData.maxNLogits,
      validatedData.desiredLogitProb,
      validatedData.nodeThreshold,
      validatedData.edgeThreshold,
      validatedData.slug,
    );

    console.log('data generated');

    // simple check TODO: do better check
    if (data.links.length === 0 || data.nodes.length === 0) {
      return NextResponse.json({
        error: 'Invalid Graph Generated',
      });
    }

    // once we have the data, upload it to S3

    const key = `${GRAPH_S3_USER_GRAPHS_DIR}/${request.user.id}/${validatedData.slug}.json`;

    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    const command = new PutObjectCommand({
      Bucket: NP_GRAPH_BUCKET,
      Key: key,
      ContentType: 'application/json',
      ContentLength: Buffer.byteLength(JSON.stringify(data)),
      Body: JSON.stringify(data),
    });

    await s3Client.send(command);

    const cleanUrl = `https://${NP_GRAPH_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    console.log('S3 file upload complete');

    const graph = data as CLTGraph;

    // if exists, return error (only if it's not the same user)
    const existingGraph = await prisma.graphMetadata.findUnique({
      where: {
        modelId_slug: {
          modelId: graph.metadata.scan,
          slug: graph.metadata.slug,
        },
      },
    });
    if (existingGraph && existingGraph.userId !== request.user.id) {
      return NextResponse.json(
        { error: 'This model already has this slug. Please use a different slug.' },
        { status: 400 },
      );
    }

    // graph is valid, save it to the database
    await prisma.graphMetadata.upsert({
      where: {
        modelId_slug: {
          modelId: graph.metadata.scan,
          slug: graph.metadata.slug,
        },
      },
      update: {
        userId: request.user.id,
        modelId: graph.metadata.scan,
        slug: graph.metadata.slug,
        titlePrefix: '',
        promptTokens: graph.metadata.prompt_tokens,
        prompt: graph.metadata.prompt,
        url: cleanUrl,
        isFeatured: false,
      },
      create: {
        userId: request.user.id,
        modelId: graph.metadata.scan,
        slug: graph.metadata.slug,
        titlePrefix: '',
        promptTokens: graph.metadata.prompt_tokens,
        prompt: graph.metadata.prompt,
        url: cleanUrl,
        isFeatured: false,
      },
    });

    return NextResponse.json({
      message: 'Graph saved to database',
      s3url: cleanUrl,
      url: makeGraphPublicAccessGraphUrl(graph.metadata.scan, graph.metadata.slug),
      numNodes: graph.nodes.length,
      numLinks: graph.links.length,
    });
  } catch (error) {
    console.error('Error generating graph:', error);

    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ error: 'Validation error', details: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message.indexOf('503') > -1) {
      return NextResponse.json(
        {
          error: 'GPU Busy',
          message:
            'Someone else is currently running a graph generation and taking up the GPU. Please try again in a minute.',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate graph', message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
});
