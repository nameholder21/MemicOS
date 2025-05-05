import { CLTGraph, makeGraphPublicAccessGraphUrl } from '@/app/[modelId]/circuit/clt/clt-utils';
import { prisma } from '@/lib/db';
import { getUserByName } from '@/lib/db/user';
import { RequestAuthedUser, withAuthedUser } from '@/lib/with-user';
import { NextResponse } from 'next/server';
import { object, string } from 'yup';

const saveToDbSchema = object({
  putRequestId: string().required(),
});

/**
 * @swagger
 * /api/graph/save-to-db:
 *   post:
 *     summary: Upload Graph 2/2 - Save Graph Metadata to Database
 *     description: Saves metadata about an uploaded graph file to the database after it has been uploaded to S3.
 *     tags:
 *       - Circuit Graphs
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - putRequestId
 *             properties:
 *               putRequestId:
 *                 type: string
 *                 description: ID of the previously created put request record
 *     responses:
 *       200:
 *         description: Successfully saved graph metadata to database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL to access the saved graph
 */

export const POST = withAuthedUser(async (request: RequestAuthedUser) => {
  const bodyJson = await request.json();
  if (!bodyJson) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const user = await getUserByName(request.user.name);

  try {
    const body = await saveToDbSchema.validate(bodyJson);
    const userId = user.id;

    // look up the put request in the database
    const putRequest = await prisma.graphMetadataDataPutRequest.findUniqueOrThrow({
      where: {
        id: body.putRequestId,
      },
    });

    // download the file from s3 and parse it as a CLTGraph
    // remove query params from the url
    const cleanUrl = putRequest.url.split('?')[0];
    const response = await fetch(cleanUrl);
    const graph = (await response.json()) as CLTGraph;

    // if the graph is not valid, return an error
    if (!graph.metadata || !graph.nodes || !graph.links) {
      return NextResponse.json({ error: 'Invalid graph' }, { status: 400 });
    }

    // if scan or slug has weird characters, return error
    if (/[^a-zA-Z0-9_-]/.test(graph.metadata.scan) || /[^a-zA-Z0-9_-]/.test(graph.metadata.slug)) {
      return NextResponse.json(
        { error: 'Invalid scan or slug. They must be alphanumeric and contain only underscores and hyphens.' },
        { status: 400 },
      );
    }

    // if model doesn't exist in our database, return error
    const model = await prisma.model.findUnique({
      where: {
        id: graph.metadata.scan,
      },
    });
    if (!model) {
      return NextResponse.json({ error: 'Model not supported' }, { status: 400 });
    }

    // if exists, return error (only if it's not the same user)
    const existingGraph = await prisma.graphMetadata.findUnique({
      where: {
        modelId_slug: {
          modelId: graph.metadata.scan,
          slug: graph.metadata.slug,
        },
      },
    });
    if (existingGraph && existingGraph.userId !== userId) {
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
        userId,
        modelId: graph.metadata.scan,
        slug: graph.metadata.slug,
        titlePrefix: '',
        promptTokens: graph.metadata.prompt_tokens,
        prompt: graph.metadata.prompt,
        url: cleanUrl,
        isFeatured: false,
      },
      create: {
        userId,
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
      url: makeGraphPublicAccessGraphUrl(graph.metadata.scan, graph.metadata.slug),
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
});
