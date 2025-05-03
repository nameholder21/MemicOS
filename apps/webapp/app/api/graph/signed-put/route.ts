import { NP_GRAPH_BUCKET } from '@/app/[modelId]/circuit/clt/clt-utils';
import { getUserByName } from '@/lib/db/user';
import { RequestAuthedUser, withAuthedUser } from '@/lib/with-user';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { number, object, string } from 'yup';

const USER_GRAPHS_DIR = 'user-graphs';
const MAX_GRAPH_SIZE_MEGABYTES = 100;

const signedPutRequestSchema = object({
  filename: string().required(),
  contentLength: number()
    .required()
    .min(1024)
    .max(MAX_GRAPH_SIZE_MEGABYTES * 1024 * 1024),
});

export const POST = withAuthedUser(async (request: RequestAuthedUser) => {
  const bodyJson = await request.json();
  if (!bodyJson) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const user = await getUserByName(request.user.name);

  try {
    const body = await signedPutRequestSchema.validate(bodyJson);

    const userId = user.id;

    if (!body.filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const key = `${USER_GRAPHS_DIR}/${userId}/${body.filename}`;

    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    // Create the command for putting an object
    const command = new PutObjectCommand({
      Bucket: NP_GRAPH_BUCKET,
      Key: key,
      ContentType: 'application/json',
      ContentLength: body.contentLength,
    });

    // Generate the presigned URL for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      url: signedUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
});
