import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import SearchTopkByToken from './search-topk-by-token';

export default async function Page() {
  return (
    <div className="flex h-full max-h-[calc(100vh-80px)] w-full flex-col items-center justify-center px-3 py-3">
      <Card className="h-full w-full overflow-y-hidden bg-white">
        <CardHeader className="w-full pb-3 pt-5">
          <div className="flex w-full flex-row items-center justify-between">
            <CardTitle>Search TopK</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-full w-full overflow-y-hidden pt-3">
          <SearchTopkByToken />
        </CardContent>
      </Card>
    </div>
  );
}
