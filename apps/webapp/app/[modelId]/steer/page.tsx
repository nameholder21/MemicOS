import Steerer from '@/components/steer/steerer';

// this page url is formatted as: /gemma-2-9b-it/steer?saved=cm1l96eeu000nooqkir7bq9lw
export default async function Page({
  params,
  searchParams,
}: {
  params: { modelId: string };
  searchParams: { saved?: string; source?: string; index?: string; strength?: string };
}) {
  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
      <Steerer
        initialModelId={params.modelId}
        initialSavedId={searchParams.saved}
        initialSource={searchParams.source}
        initialIndex={searchParams.index}
        initialStrength={searchParams.strength}
      />
    </div>
  );
}
