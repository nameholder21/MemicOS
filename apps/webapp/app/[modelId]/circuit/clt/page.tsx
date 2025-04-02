import { CircuitCLTProvider } from '@/components/provider/circuit-clt-provider';
import { getCLTMetadata } from './clt-utils';
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

  const metadata = await getCLTMetadata();

  return (
    <CircuitCLTProvider
      initialMetadata={metadata}
      initialClickedId={searchParams.clickedId}
      initialLogitDiff={searchParams.logitDiff}
    >
      <CLTWrapper />
    </CircuitCLTProvider>
  );
}
