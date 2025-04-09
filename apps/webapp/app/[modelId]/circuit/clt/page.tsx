import { CircuitCLTProvider } from '@/components/provider/circuit-clt-provider';
import { BASE_URLS, getCLTMetadata, ModelToCLTMetadataGraphsMap } from './clt-utils';
import CLTWrapper from './wrapper';

export default async function Page({
  // params,
  searchParams,
}: {
  // params: { modelId: string };
  searchParams: { clickedId?: string; logitDiff?: string };
}) {
  // const { modelId } = params;
  // const model = await getModelByIdWithSourceSets(modelId, await makeAuthedUserFromSessionOrReturnNull());

  // if (!model) {
  //   notFound();
  // }

  let metadata: ModelToCLTMetadataGraphsMap | null = null;
  const modelToBaseUrl: Record<string, string> = {};
  // eslint-disable-next-line
  for (const baseUrl of BASE_URLS) {
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
            if (metadata) {
              if (!metadata[scanId]) {
                metadata[scanId] = result[scanId];
              } else {
                metadata[scanId] = [...metadata[scanId], ...result[scanId]];
              }
            }
          });
        }
        Object.keys(result).forEach((scanId) => {
          modelToBaseUrl[scanId] = baseUrl;
        });
      }
    } catch (error) {
      console.error(`Failed to fetch metadata from ${baseUrl}:`, error);
    }
  }
  if (!metadata) {
    return <div>No metadata found</div>;
  }

  return (
    <CircuitCLTProvider
      initialMetadata={metadata}
      initialModelToBaseUrl={modelToBaseUrl}
      initialClickedId={searchParams.clickedId}
      initialLogitDiff={searchParams.logitDiff}
    >
      <CLTWrapper />
    </CircuitCLTProvider>
  );
}
