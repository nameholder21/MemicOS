import { CircuitCLTProvider } from '@/components/provider/circuit-clt-provider';
import { prisma } from '@/lib/db';
import {
  getGraphMetadatasFromBucket,
  GRAPH_BASE_URLS,
  ModelToGraphMetadatasMap,
  supportedGraphModels,
} from './clt-utils';
import CLTWrapper from './wrapper';

export default async function Page({
  // params,
  searchParams,
}: {
  // params: {};
  searchParams: {
    clickedId?: string;
    logitDiff?: string;
    model?: string;
    slug?: string;
    pinnedIds?: string;
    supernodes?: string;
    clerps?: string;
  };
}) {
  // TODO: update this to use modelid from url
  // const { modelId } = params;
  // const model = await getModelByIdWithSourceSets(modelId, await makeAuthedUserFromSessionOrReturnNull());

  // if (!model) {
  //   notFound();
  // }

  // iterate through all baseUrls/buckets, and merge all the metadata into a single map
  const modelIdToGraphMetadatasMap: ModelToGraphMetadatasMap = {};

  // first, get all the graphmetadatas from the buckets
  // eslint-disable-next-line
  for (const baseUrl of GRAPH_BASE_URLS) {
    try {
      const modelIdToGraphMetadata = await getGraphMetadatasFromBucket(baseUrl);

      // eslint-disable-next-line
      Object.keys(modelIdToGraphMetadata)
        .filter((modelId) => supportedGraphModels.has(modelId))
        .forEach((modelId) => {
          // if we don't have the modelId in the map, add it and all its graphs
          if (!modelIdToGraphMetadatasMap[modelId]) {
            modelIdToGraphMetadatasMap[modelId] = modelIdToGraphMetadata[modelId];
          } else {
            // if we already have the modelId in the map, add all its graphs to the existing array
            modelIdToGraphMetadatasMap[modelId] = [
              ...modelIdToGraphMetadatasMap[modelId],
              ...modelIdToGraphMetadata[modelId],
            ];
          }
        });
    } catch (error) {
      console.error(`Failed to fetch metadata from ${baseUrl}:`, error);
    }
  }

  // now look up graphmetadatas in our database
  const graphMetadatas = await prisma.graphMetadata.findMany({
    where: {
      modelId: {
        in: Object.keys(modelIdToGraphMetadatasMap),
      },
    },
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
    modelIdToGraphMetadatasMap[graphMetadata.modelId].push(graphMetadata);
  });

  const metadataGraph = searchParams.model
    ? modelIdToGraphMetadatasMap[searchParams.model]?.find((graph) => graph.slug === searchParams.slug)
    : undefined;

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
    <CircuitCLTProvider
      initialModelIdToMetadataGraphsMap={modelIdToGraphMetadatasMap}
      initialModel={searchParams.model}
      initialMetadataGraph={metadataGraph}
      initialPinnedIds={searchParams.pinnedIds}
      initialClickedId={searchParams.clickedId}
      initialSupernodes={parsedSupernodes}
      initialClerps={parsedClerps}
    >
      <CLTWrapper />
    </CircuitCLTProvider>
  );
}
