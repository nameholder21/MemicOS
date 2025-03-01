'use client';

import InferenceSearcher from '@/components/inference-searcher/inference-searcher';
import InferenceActivationAllProvider from '@/components/provider/inference-activation-all-provider';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { getDefaultSourceSetAndSourceForRelease, getFirstSourceForRelease } from '@/lib/utils/source';
import { SourceReleaseWithPartialRelations, SourceSetWithPartialRelations } from '@/prisma/generated/zod';
import { Visibility } from '@prisma/client';

export default function SearchInferenceReleasePane({ release }: { release?: SourceReleaseWithPartialRelations }) {
  let defaultSourceSet: SourceSetWithPartialRelations | undefined;

  if (release) {
    ({ defaultSourceSet } = getDefaultSourceSetAndSourceForRelease(release));
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="w-full pb-3  pt-5">
        <div className="flex w-full flex-row items-center justify-between">
          <CardTitle>Search via Inference</CardTitle>
          <a href="https://docs.memicos.org/search" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="flex flex-row gap-x-2 rounded-full text-sm font-semibold text-slate-400 shadow-sm"
            >
              ?
            </Button>
          </a>
        </div>
      </CardHeader>
      <CardContent className="">
        {release ? (
          getFirstSourceForRelease(release, Visibility.PUBLIC, true) ? (
            <InferenceActivationAllProvider>
              <InferenceSearcher
                showSourceSets
                showModels
                initialSourceSet={defaultSourceSet?.name || ''}
                initialModelId={defaultSourceSet?.modelId || ''}
                showExamples
                filterToRelease={release.name}
              />
            </InferenceActivationAllProvider>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="pb-3 pt-2 text-center text-sm font-semibold text-slate-400">
                Inference is not currently not enabled for this.
                <br />
                Contact the MemicOS team to request it.
              </div>
            </div>
          )
        ) : (
          <InferenceActivationAllProvider>
            <InferenceSearcher initialSelectedLayers={[]} showModels initialSortIndexes={[]} />
          </InferenceActivationAllProvider>
        )}
      </CardContent>
    </Card>
  );
}
