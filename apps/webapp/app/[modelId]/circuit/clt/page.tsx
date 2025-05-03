import { CircuitCLTProvider } from '@/components/provider/circuit-clt-provider';
import { getUserNames } from '@/lib/db/user';
import {
  getGraphMetadatasFromBucket,
  GRAPH_BASE_URLS,
  ModelToCLTGraphMetadatasMap,
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
  const modelIdToGraphMetadatasMap: ModelToCLTGraphMetadatasMap = {};
  const userIdsToLookUp: Set<string> = new Set();
  // eslint-disable-next-line
  for (const baseUrl of GRAPH_BASE_URLS) {
    try {
      // eslint-disable-next-line
      const modelIdToGraphMetadata = await getGraphMetadatasFromBucket(baseUrl);
      if (modelIdToGraphMetadata) {
        // eslint-disable-next-line
        Object.keys(modelIdToGraphMetadata).forEach((modelId) => {
          // add the correct baseUrl to each graph before adding it to the map
          modelIdToGraphMetadata[modelId].forEach((graph) => {
            // eslint-disable-next-line
            userIdsToLookUp.add(graph.userId);
          });
          // only add models that are supported
          if (supportedGraphModels.has(modelId)) {
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
          }
        });
      }
    } catch (error) {
      console.error(`Failed to fetch metadata from ${baseUrl}:`, error);
    }
  }
  if (!modelIdToGraphMetadatasMap) {
    return <div>No metadata found</div>;
  }

  const userIdsToLookUpArray = Array.from(userIdsToLookUp);
  const userNames = await getUserNames(userIdsToLookUpArray);
  // fill the userName field for each graph
  Object.keys(modelIdToGraphMetadatasMap).forEach((modelId) => {
    modelIdToGraphMetadatasMap[modelId].forEach((graph) => {
      // eslint-disable-next-line
      graph.userName = userNames.find((user) => user.id === graph.userId)?.name;
    });
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
