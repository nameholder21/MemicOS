import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import Browse from './browser';

export default function BrowserPane({
  modelId,
  sourceSet,
  layer,
  showModel,
  filterToRelease,
}: {
  modelId: string;
  sourceSet: string;
  layer: string;
  showModel: boolean;
  filterToRelease?: string;
}) {
  return (
    <div className="hidden w-full flex-1 flex-col items-start pb-0 pt-0 sm:flex">
      <Card className="w-full bg-white">
        <CardHeader className="w-full pb-3 pt-5">
          <div className="flex w-full flex-row items-center justify-between">
            <CardTitle>Browse</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Browse
            defaultModelId={modelId}
            defaultSourceSet={sourceSet}
            defaultLayer={layer}
            showModel={showModel}
            filterToRelease={filterToRelease}
          />
        </CardContent>
      </Card>
    </div>
  );
}
