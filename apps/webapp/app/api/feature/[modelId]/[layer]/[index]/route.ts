import { getNeuronOptimized } from '@/lib/db/neuron';
import { RequestOptionalUser, withOptionalUser } from '@/lib/with-user';
import { NextResponse } from 'next/server';

/**
@swagger
{
  "/api/feature/{modelId}/{layer}/{index}": {
    "get": {
      "tags": [
        "Features"
      ],
      "summary": "Get Feature",
      "security": [{
          "apiKey": []
      }],
      "description": "Returns a feature, including its activations and explanations.",
      "parameters": [
        {
          "name": "modelId",
          "in": "path",
          "description": "Model ID",
          "required": true,
          "schema": {
            "type": "string",
            "default": "gpt2-small"
          }
        },
        {
          "name": "layer",
          "in": "path",
          "description": "SAE ID or Layer",
          "required": true,
          "schema": {
            "type": "string",
            "default": "0-res-jb"
          }
        },
        {
          "name": "index",
          "in": "path",
          "description": "Index",
          "required": true,
          "schema": {
            "type": "number",
            "default": 14057
          }
        }
      ],
      "responses": {
        "200": {
          "description": null
        }
      }
    }
  }
}
 */

export const GET = withOptionalUser(
  async (
    request: RequestOptionalUser,
    {
      params,
    }: {
      params: { modelId: string; layer: string; index: string };
    },
  ) => {
    const neuron = await getNeuronOptimized(params.modelId, params.layer, params.index, request.user);
    if (!neuron) {
      NextResponse.json({ error: 'Feature Not Found' });
    }

    return NextResponse.json(neuron);
  },
);
