import { GraphProvider } from '@/components/provider/graph-provider';
import { prisma } from '@/lib/db';
import {
  getGraphMetadatasFromBucket,
  GRAPH_BASE_URL_TO_NAME,
  ModelToGraphMetadatasMap,
  supportedGraphModels,
} from './utils';
import GraphWrapper from './wrapper';

export default async function Page({
  params,
  searchParams,
}: {
  params: { modelId: string };
  searchParams: {
    clickedId?: string;
    logitDiff?: string;
    // model?: string;
    slug?: string;
    pinnedIds?: string;
    supernodes?: string;
    clerps?: string;
    pruningThreshold?: string;
  };
}) {
  const { modelId } = params;

  // TODO: checks for model existence (current not used bc we have anthropic models)
  // const model = await getModelByIdWithSourceSets(modelId, await makeAuthedUserFromSessionOrReturnNull());
  // if (!model) {
  //   notFound();
  // }

  // iterate through all baseUrls/buckets, and merge all the metadata into a single map
  const modelIdToGraphMetadatasMap: ModelToGraphMetadatasMap = {};

  // first, get all the graphmetadatas from the buckets
  // eslint-disable-next-line
  for (const baseUrl of Object.keys(GRAPH_BASE_URL_TO_NAME)) {
    try {
      const modelIdToGraphMetadata = await getGraphMetadatasFromBucket(baseUrl);

      // eslint-disable-next-line
      Object.keys(modelIdToGraphMetadata)
        .filter((m) => supportedGraphModels.has(m))
        .forEach((m) => {
          // if we don't have the modelId in the map, add it and all its graphs
          if (!modelIdToGraphMetadatasMap[m]) {
            modelIdToGraphMetadatasMap[m] = modelIdToGraphMetadata[m];
          } else {
            // if we already have the modelId in the map, add all its graphs to the existing array
            modelIdToGraphMetadatasMap[m] = [...modelIdToGraphMetadatasMap[m], ...modelIdToGraphMetadata[m]];
          }
        });
    } catch (error) {
      console.error(`Failed to fetch metadata from ${baseUrl}:`, error);
    }
  }

  // now look up graphmetadatas in our database
  const graphMetadatas = await prisma.graphMetadata.findMany({
    // where: {
    //   modelId: {
    //     in: Object.keys(modelIdToGraphMetadatasMap),
    //   },
    // },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // add those graphmetadatas to the modelIdToGraphMetadatasMap too
  graphMetadatas.forEach((graphMetadata) => {
    // if the modelId is not in the map, add it
    if (!modelIdToGraphMetadatasMap[graphMetadata.modelId]) {
      modelIdToGraphMetadatasMap[graphMetadata.modelId] = [];
    }
    // ensure that there is no existing graph with the same slug
    // we don't want a user-uploaded graph to override a featured graph
    if (!modelIdToGraphMetadatasMap[graphMetadata.modelId].find((graph) => graph.slug === graphMetadata.slug)) {
      modelIdToGraphMetadatasMap[graphMetadata.modelId].push(graphMetadata);
    }
  });

  const metadataGraph = modelIdToGraphMetadatasMap[modelId]?.find((graph) => graph.slug === searchParams.slug);

  let parsedSupernodes: string[][] | undefined;
  try {
    parsedSupernodes = searchParams.supernodes ? JSON.parse(searchParams.supernodes) : undefined;
  } catch (error) {
    console.error('Error parsing supernodes:', error);
  }

  let parsedClerps: string[][] | undefined;
  try {
    parsedClerps = searchParams.clerps ? JSON.parse(searchParams.clerps) : undefined;
  } catch (error) {
    console.error('Error parsing clerps:', error);
  }

  return (
    <GraphProvider
      initialModelIdToMetadataGraphsMap={modelIdToGraphMetadatasMap}
      initialModel={modelId}
      initialMetadataGraph={metadataGraph}
      initialPinnedIds={searchParams.pinnedIds}
      initialClickedId={searchParams.clickedId}
      initialSupernodes={parsedSupernodes}
      initialClerps={parsedClerps}
      initialPruningThreshold={searchParams.pruningThreshold ? Number(searchParams.pruningThreshold) : undefined}
    >
      <GraphWrapper />
    </GraphProvider>
  );
}
