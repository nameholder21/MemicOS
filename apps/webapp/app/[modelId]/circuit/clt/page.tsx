import { CircuitCLTProvider } from '@/components/provider/circuit-clt-provider';
import { CLT_BASE_URLS, getCLTMetadata, metadataScansToDisplay, ModelToCLTMetadataGraphsMap } from './clt-utils';
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

  let metadata: ModelToCLTMetadataGraphsMap | null = null;
  const modelToBaseUrlMap: Record<string, string> = {};
  // eslint-disable-next-line
  for (const baseUrl of CLT_BASE_URLS) {
    try {
      // eslint-disable-next-line
      const result = await getCLTMetadata(baseUrl);
      if (result) {
        if (!metadata) {
          metadata = result;
        } else {
          // Merge the results
          // eslint-disable-next-line
          Object.keys(result).forEach((scanId) => {
            if (metadata && metadataScansToDisplay.has(scanId)) {
              if (!metadata[scanId]) {
                metadata[scanId] = result[scanId];
              } else {
                metadata[scanId] = [...metadata[scanId], ...result[scanId]];
              }
            }
          });
        }
        Object.keys(result).forEach((scanId) => {
          modelToBaseUrlMap[scanId] = baseUrl;
        });
      }
    } catch (error) {
      console.error(`Failed to fetch metadata from ${baseUrl}:`, error);
    }
  }
  if (!metadata) {
    return <div>No metadata found</div>;
  }

  const metadataGraph = searchParams.model
    ? metadata[searchParams.model]?.find((graph) => graph.slug === searchParams.slug)
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
      modelToBaseUrlMap={modelToBaseUrlMap}
      initialMetadata={metadata}
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
