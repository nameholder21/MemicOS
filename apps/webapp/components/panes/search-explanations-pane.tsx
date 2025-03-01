'use client';

import ExplanationsSearcher from '@/components/explanations-searcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { SearchExplanationsType } from '@/lib/utils/general';
import { SourceReleaseWithPartialRelations } from '@/prisma/generated/zod';
import { useSearchParams } from 'next/navigation';

export default function SearchExplanationsPane({
  searchQuery,
  initialReleaseName,
  initialSelectedLayers,
  initialModelId,
  initialSourceSetName,
  filterToRelease,
  defaultTab,
  showTabs = true,
}: {
  searchQuery?: string;
  initialReleaseName?: string;
  initialSelectedLayers?: string[];
  initialModelId: string;
  initialSourceSetName?: string;
  filterToRelease?: SourceReleaseWithPartialRelations;
  defaultTab?: string;
  showTabs?: boolean;
}) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  return (
    <Card className={`w-full bg-white ${isEmbed ? 'rounded-none' : ''}`}>
      <CardHeader className="w-full pb-3 pt-5">
        <div className="flex w-full flex-row items-center justify-between">
          <CardTitle>Search Explanations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="">
        <ExplanationsSearcher
          initialSearchQuery={searchQuery}
          initialReleaseName={initialReleaseName}
          initialSelectedLayers={initialSelectedLayers}
          initialModelId={initialModelId}
          initialSourceSetName={initialSourceSetName}
          filterToRelease={filterToRelease?.name}
          defaultTab={defaultTab as SearchExplanationsType}
          showTabs={showTabs}
        />
      </CardContent>
    </Card>
  );
}
