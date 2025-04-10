import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import SearchTopkByToken from './search-topk-by-token';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const modelId = typeof searchParams.modelId === 'string' ? searchParams.modelId : undefined;
  const source = typeof searchParams.source === 'string' ? searchParams.source : undefined;
  const text = typeof searchParams.text === 'string' ? searchParams.text : undefined;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-3 py-3 sm:max-h-[calc(100vh-80px)]">
      <Card className="h-full w-full overflow-y-hidden bg-white">
        <CardHeader className="w-full pb-3 pt-5">
          <div className="flex w-full flex-row items-center justify-between">
            <CardTitle>Search TopK by Token</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-full w-full overflow-y-hidden pt-3">
          <SearchTopkByToken initialModelId={modelId} initialSource={source} initialText={text} />
        </CardContent>
      </Card>
    </div>
  );
}
