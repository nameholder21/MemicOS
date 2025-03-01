'use client';

import LayerSelector from '@/components/feature-selector/layer-selector';
import ModelSelector from '@/components/feature-selector/model-selector';
import SourceSetSelector from '@/components/feature-selector/sourceset-selector';
import { useGlobalContext } from '@/components/provider/global-provider';
import InferenceActivationAllProvider from '@/components/provider/inference-activation-all-provider';
import { UMAP_INITIAL_COLORS } from '@/components/provider/umap-provider';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import Umap from '@/components/umap/umap';
import { getLayerNumAsStringFromSource } from '@/lib/utils/source';
import { SourceReleaseWithPartialRelations } from '@/prisma/generated/zod';
import Link from 'next/link';
import { useState } from 'react';

export default function UmapPane({
  defaultModelId,
  defaultSourceSet,
  defaultLayer,
  release,
  showModel,
  filterToRelease,
  releaseMultipleUmapSAEs,
  newWindowOnSaeChange,
}: {
  defaultModelId: string;
  defaultSourceSet: string;
  defaultLayer: string;
  release: SourceReleaseWithPartialRelations;
  showModel: boolean;
  filterToRelease: string;
  releaseMultipleUmapSAEs: string[];
  newWindowOnSaeChange: boolean;
}) {
  const { getSourceSetForSource, getSourceSetsForModelId, getFirstSourceForSourceSet } = useGlobalContext();

  const [modelId, setModelId] = useState(defaultModelId);
  const [sourceSet, setSourceSet] = useState(defaultSourceSet);
  const [layer, setLayer] = useState(defaultLayer);

  const modelIdChanged = (newModelId: string) => {
    const newSourceSet = getSourceSetsForModelId(newModelId)?.[0].name;
    if (newWindowOnSaeChange) {
      window.open(`/${newModelId}/${getFirstSourceForSourceSet(newModelId, newSourceSet)}`, '_blank');
    } else {
      setModelId(newModelId);
      setSourceSet(newSourceSet);
      setLayer(getFirstSourceForSourceSet(newModelId, newSourceSet));
    }
  };

  const sourceSetChanged = (newSourceSet: string) => {
    if (newWindowOnSaeChange) {
      window.open(`/${modelId}/${getFirstSourceForSourceSet(modelId, newSourceSet)}`, '_blank');
    } else {
      setSourceSet(newSourceSet);
      setLayer(getFirstSourceForSourceSet(modelId, newSourceSet));
    }
  };

  const layerChanged = (newLayer: string) => {
    setLayer(newLayer);
  };

  return (
    <div className="hidden w-full flex-1 flex-col items-start pb-0 pt-3 sm:flex">
      <Card className="w-full bg-white">
        <CardHeader className="w-full pb-3 pt-5">
          <div className="flex w-full flex-row items-center justify-between">
            <CardTitle>UMAP</CardTitle>
            <a
              href="https://en.wikipedia.org/wiki/Nonlinear_dimensionality_reduction#:~:text=Uniform%20manifold%20approximation%20and%20projection%20(UMAP)%20is%20a%20nonlinear%20dimensionality,constant%20or%20approximately%20locally%20constant."
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="sm" className="flex flex-row gap-x-2 text-xs text-slate-500 shadow-sm">
                <span>About UMAP</span>
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent className="">
          <InferenceActivationAllProvider>
            <div className="relative flex h-full w-full flex-col gap-x-3 sm:pt-0">
              {/* Either a selector or list of UMAPs (multiple umaps) */}
              <div className="relative mx-auto mb-2 flex w-full max-w-screen-xl flex-row items-center justify-between gap-y-2 sm:mb-0 sm:gap-y-0">
                {release.defaultUmapSourceIds.length === 0 ? (
                  <div className="flex flex-1 select-none flex-row justify-start gap-x-1.5 overflow-hidden pb-2 text-center font-mono text-sm font-bold uppercase leading-none text-slate-700 sm:w-auto sm:gap-x-1.5 sm:text-sm">
                    {showModel && (
                      <ModelSelector
                        modelId={modelId}
                        modelIdChangedCallback={modelIdChanged}
                        filterToRelease={filterToRelease}
                      />
                    )}
                    <SourceSetSelector
                      modelId={modelId}
                      sourceSet={sourceSet}
                      sourceSetChangedCallback={sourceSetChanged}
                      filterToRelease={filterToRelease}
                    />
                    <LayerSelector
                      modelId={modelId}
                      sourceSet={sourceSet}
                      layer={layer}
                      layerChangedCallback={layerChanged}
                    />
                  </div>
                ) : (
                  <div className="mb-2.5 flex w-full flex-row items-center justify-center gap-x-4">
                    {releaseMultipleUmapSAEs.map((umapSourceId, i) => (
                      <Link
                        key={umapSourceId}
                        href={`/${modelId}/${umapSourceId}`}
                        className="flex flex-row items-center justify-center gap-x-1 text-center text-[11px] text-sky-700"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: UMAP_INITIAL_COLORS[i],
                          }}
                        />
                        {getLayerNumAsStringFromSource(umapSourceId)} -{' '}
                        {getSourceSetForSource(modelId, umapSourceId)?.description}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Umap
                modelId={modelId}
                sourceSet={sourceSet}
                layers={releaseMultipleUmapSAEs.length > 0 ? releaseMultipleUmapSAEs : [layer]}
              />
            </div>
          </InferenceActivationAllProvider>
        </CardContent>
      </Card>
    </div>
  );
}
