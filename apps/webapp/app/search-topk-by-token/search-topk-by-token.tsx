'use client';

import LayerSelector from '@/components/feature-selector/layer-selector';
import ModelSelector from '@/components/feature-selector/model-selector';
import SourceSetSelector from '@/components/feature-selector/sourceset-selector';
import { useGlobalContext } from '@/components/provider/global-provider';
import { LoadingSquare } from '@/components/svg/loading-square';
import { DEFAULT_MODELID } from '@/lib/env';
import { useIsMount } from '@/lib/hooks/use-is-mount';
import useWindowSize from '@/lib/hooks/use-window-size';
import { SearchTopKResult } from '@/lib/utils/inference';
import { INFERENCE_EXAMPLE_TEXTS } from '@/lib/utils/inference-example-texts';
import { getFirstSourceSetForModel, getSourceSetNameFromSource } from '@/lib/utils/source';
import { Visibility } from '@prisma/client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Form, Formik, FormikProps } from 'formik';
import { Dices, ExternalLink, PlayIcon, Search, X } from 'lucide-react';
import { NeuronWithPartialRelations } from 'prisma/generated/zod';
import { useEffect, useRef, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

type TopKFeature = {
  index: number;
  feature: NeuronWithPartialRelations;
  activation_value: number;
  frequency: number;
};

export default function SearchTopkByToken({
  initialModelId,
  initialLayer,
  filterModelsToRelease,
}: {
  initialModelId?: string;
  initialLayer?: string;
  filterModelsToRelease?: string;
}) {
  const [topkResult, setTopkResult] = useState<SearchTopKResult | undefined>();
  const [topkFeatures, setTopkFeatures] = useState<TopKFeature[] | undefined>(undefined);
  const [hoveredTokenPosition, setHoveredTokenPosition] = useState<number>(-1);
  const [lockedTokenPosition, setLockedTokenPosition] = useState<number>(-1);
  const [hoveredNeuronIndex, setHoveredNeuronIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [needsReloadSearch, setNeedsReloadSearch] = useState(false);
  const [modelId, setModelId] = useState(initialModelId || DEFAULT_MODELID);
  const [layer, setLayer] = useState(initialLayer);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { windowSize } = useWindowSize();
  const isMount = useIsMount();
  // eslint-disable-next-line
  const [sortNeurons, setSortNeurons] = useState<'frequency' | 'strength'>('frequency');
  const {
    getFirstSourceForSourceSet,
    globalModels,
    showToastServerError,
    setFeatureModalFeature,
    setFeatureModalOpen,
  } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxAct, setMaxAct] = useState<number>(0);
  const [hideDense, setHideDense] = useState<boolean>(true);
  const [sourceSet, setSourceSet] = useState<string>(initialLayer ? getSourceSetNameFromSource(initialLayer) : '');
  const [ignoreBos, setIgnoreBos] = useState<boolean>(true);
  const formRef = useRef<
    FormikProps<{
      searchQuery: string;
    }>
  >(null);

  async function searchClicked(overrideText?: string) {
    setIsSearching(true);
    setNeedsReloadSearch(false);
    setLockedTokenPosition(-1);
    setHoveredTokenPosition(-1);
    setSearchQuery(overrideText || formRef.current?.values.searchQuery || '');
    const result = await fetch(`/api/search-topk-by-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId,
        text: overrideText || formRef.current?.values.searchQuery,
        layer,
        ignoreBos,
        densityThreshold: hideDense ? 0.01 : -1,
      }),
    });
    setNeedsReloadSearch(false);
    if (result.status === 429 || result.status === 405) {
      alert('Sorry, we are limiting each user to 100 search requests per hour. Please try again later.');
    } else if (result.status !== 200) {
      showToastServerError();
    } else {
      const res = await result.json();
      const resultData = res as SearchTopKResult;
      setTopkResult(resultData);
    }
    setIsSearching(false);
  }

  function getSortedFeatures(feats: TopKFeature[]) {
    if (sortNeurons === 'strength') {
      return feats.toSorted((a, b) => b.activation_value - a.activation_value);
    }
    if (sortNeurons === 'frequency') {
      return feats.toSorted((a, b) => b.frequency - a.frequency);
    }
    return feats;
  }

  useEffect(() => {
    if (topkResult) {
      let toSet: TopKFeature[] = [];
      topkResult.results.forEach((result) => {
        result.topFeatures.forEach((feature) => {
          if (result.token === '<bos>' || result.token === '<eos>') {
            return;
          }
          toSet.push({
            feature: feature.feature as NeuronWithPartialRelations,
            activation_value: feature.activationValue,
            frequency: 1,
            index: feature.featureIndex,
          });
        });
      });

      // set the frequency, which is the number of times that index appears
      toSet = toSet.map((f) => {
        // eslint-disable-next-line
        f.frequency = toSet.filter((f2) => f2.index === f.index).length;
        return f;
      });

      // deduplicate by toSet.index
      toSet = toSet.filter((v, i, a) => a.findIndex((t) => t.index === v.index) === i);

      // get the max activating value
      setMaxAct(Math.max(...toSet.map((f) => f.activation_value)));
      setTopkFeatures(getSortedFeatures(toSet));
    }
  }, [topkResult]);

  useEffect(() => {
    if (topkFeatures) {
      setTopkFeatures(getSortedFeatures(topkFeatures));
    }
  }, [sortNeurons]);

  useEffect(() => {
    if (scrollRef.current && windowSize.width && windowSize.width < 640) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [topkFeatures, lockedTokenPosition, hoveredTokenPosition]);

  const sourceSetChangedCallback = (newSourceSet: string) => {
    setSourceSet(newSourceSet);
    const sourceId = getFirstSourceForSourceSet(modelId, newSourceSet);
    if (sourceId && !isMount) {
      setLayer(sourceId);
    }
  };

  useEffect(() => {
    if (sourceSet) {
      sourceSetChangedCallback(sourceSet);
    }
  }, [sourceSet]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setNeedsReloadSearch(true);
    }
  }, [ignoreBos, hideDense, layer, modelId, sourceSet]);

  const modelIdChangedCallback = (newModelId: string) => {
    if (globalModels[newModelId]) {
      setModelId(newModelId);
      const sourceSetFirst = getFirstSourceSetForModel(globalModels[newModelId], Visibility.PUBLIC, true, false);
      setSourceSet(sourceSetFirst?.name || '');
    }
  };

  useEffect(() => {
    if (modelId) {
      modelIdChangedCallback(modelId);
    }
  }, [modelId]);

  return (
    <div className="mt-0 flex h-full w-full flex-row items-center justify-center pt-0">
      <div className="flex h-full max-w-screen-md flex-1 flex-col">
        <div className="flex w-full flex-row items-center justify-center gap-x-4">
          <ModelSelector
            filterToRelease={filterModelsToRelease}
            modelId={modelId}
            filterToInferenceEnabled
            modelIdChangedCallback={modelIdChangedCallback}
          />
          <SourceSetSelector
            modelId={modelId}
            sourceSet={sourceSet}
            filterToOnlyVisible
            filterToInferenceEnabled
            sourceSetChangedCallback={sourceSetChangedCallback}
            filterToAllowInferenceSearch
          />
          <LayerSelector
            modelId={modelId}
            layer={layer}
            sourceSet={sourceSet}
            filterToInferenceEnabled
            layerChangedCallback={setLayer}
          />
        </div>
        <div id="searchfield" className="my-3 mt-4 flex w-full flex-row items-center justify-center">
          <Formik
            innerRef={formRef}
            initialValues={{ searchQuery: '' }}
            onSubmit={async () => {
              await searchClicked();
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="relative flex w-full flex-col gap-x-1.5 gap-y-1.5 sm:flex-row">
                <ReactTextareaAutosize
                  name="searchQuery"
                  disabled={isSearching}
                  value={values.searchQuery}
                  minRows={2}
                  onChange={(e) => {
                    if (topkResult) {
                      setNeedsReloadSearch(true);
                    }
                    setFieldValue('searchQuery', e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  required
                  placeholder={`Make ${modelId} think about...`}
                  className="mt-0 min-w-[10px] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-3 pl-9 pr-9  text-left text-sm font-medium text-slate-700 placeholder-slate-400 shadow-sm transition-all hover:shadow-lg focus:border-sky-700 focus:shadow-lg  focus:outline-none focus:ring-0 disabled:bg-slate-200 sm:text-[13px]"
                />
                <Search className="absolute left-3 my-auto h-full w-4 text-slate-400" />
                {values.searchQuery.length > 0 && (
                  <div className="absolute right-3 my-auto flex h-full items-center justify-center">
                    <X
                      className="h-5 w-5 rounded-full bg-slate-200 p-1 hover:bg-slate-300"
                      onClick={() => {
                        setFieldValue('searchQuery', '');
                      }}
                    />
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <div id="imfeelinglucky" className="mb-0 mt-0 flex w-full flex-row items-center justify-between">
          <button
            type="button"
            disabled={isSearching}
            onClick={async (e) => {
              e.preventDefault();
              const randomSentence =
                INFERENCE_EXAMPLE_TEXTS[Math.floor(Math.random() * INFERENCE_EXAMPLE_TEXTS.length)];
              formRef.current?.setFieldValue('searchQuery', randomSentence);
              await searchClicked(randomSentence);
            }}
            className="flex min-w-[140px] cursor-pointer flex-row justify-center gap-x-2 rounded-full border border-sky-700 bg-white px-5 py-2 text-[12px] font-medium text-sky-700 shadow transition-all hover:scale-105 hover:bg-sky-700/20 disabled:opacity-50"
          >
            <Dices className="h-5 w-5 text-sky-700" />
            Random
          </button>
          <button
            type="button"
            onClick={() => {
              searchClicked();
            }}
            disabled={
              isSearching ||
              searchQuery.length === 0 ||
              (searchQuery.length > 0 && !needsReloadSearch && topkResult && topkResult.results.length > 0)
            }
            className="flex min-w-[140px] flex-row items-center justify-center gap-x-1.5 rounded-full bg-sky-700 px-5 py-2 text-[12px] font-medium text-white shadow transition-all enabled:hover:bg-sky-700/80  enabled:hover:text-white disabled:opacity-50"
          >
            <PlayIcon className="h-5 w-5 text-white" /> Go
          </button>
        </div>

        {needsReloadSearch && (
          <div className="mt-4 flex w-full flex-row items-center justify-center gap-x-3 rounded-md bg-slate-100 py-2 text-[13px] text-slate-600">
            Search parameters changed.{' '}
            <button
              type="button"
              className="rounded-md bg-sky-700 px-3 py-2 text-[10px] font-medium uppercase leading-none text-white transition-all hover:bg-sky-900"
              onClick={() => {
                searchClicked();
              }}
            >
              Reload Search
            </button>
          </div>
        )}

        <div className=" mt-5 flex w-full flex-col gap-y-2 border-t border-t-slate-200 pt-5">
          <div className="w-full text-center text-[9px] font-medium  uppercase text-slate-400">Settings</div>
          <ToggleGroup.Root
            className="inline-flex flex-1 overflow-hidden rounded-md border border-slate-300 bg-slate-300 px-0 py-0"
            type="single"
            defaultValue={hideDense ? 'hideHighDensity' : 'showHighDensity'}
            value={hideDense ? 'hideHighDensity' : 'showHighDensity'}
            onValueChange={(value) => {
              setHideDense(value === 'hideHighDensity');
            }}
            aria-label="hide high density or not"
          >
            <ToggleGroup.Item
              key="showHighDensity"
              className="flex-1 rounded-r-md px-1 py-2.5 text-[10px] font-medium leading-none text-slate-500 transition-all hover:bg-slate-100 data-[state=on]:bg-white data-[state=on]:text-slate-600 sm:px-4 sm:text-[11px]"
              value="showHighDensity"
              aria-label="showHighDensity"
            >
              Show &gt;1% Density
            </ToggleGroup.Item>
            <ToggleGroup.Item
              key="hideHighDensity"
              className="flex-1 rounded-l-md px-1 py-2.5 text-[10px] font-medium leading-none text-slate-500  transition-all hover:bg-slate-100 data-[state=on]:bg-white data-[state=on]:text-slate-600 sm:px-4  sm:text-[11px]"
              value="hideHighDensity"
              aria-label="hideHighDensity"
            >
              Hide &gt;1% Density
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <ToggleGroup.Root
            className="inline-flex flex-1 overflow-hidden rounded-md border border-slate-300 bg-slate-300 px-0 py-0"
            type="single"
            defaultValue={ignoreBos ? 'ignore' : 'show'}
            value={ignoreBos ? 'ignore' : 'show'}
            onValueChange={(value) => {
              setIgnoreBos(value === 'ignore');
            }}
            aria-label="Show results where the max token was the BOS token"
          >
            <ToggleGroup.Item
              key="show"
              className="flex-1 rounded-r-md px-1 py-2.5 text-[10px] font-medium leading-none text-slate-500 transition-all hover:bg-slate-100 data-[state=on]:bg-white data-[state=on]:text-slate-600 sm:px-4 sm:text-[11px]"
              value="show"
              aria-label="show"
            >
              Show BOS Results
            </ToggleGroup.Item>
            <ToggleGroup.Item
              key="ignore"
              className="flex-1 rounded-l-md px-1 py-2.5 text-[10px] font-medium leading-none text-slate-500 transition-all hover:bg-slate-100 data-[state=on]:bg-white data-[state=on]:text-slate-600 sm:px-4 sm:text-[11px]"
              value="ignore"
              aria-label="ignore"
            >
              Ignore BOS Results
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>
      <div
        className={`flex h-full flex-col transition-all ${
          !topkResult && !isSearching ? 'w-[0px] max-w-[0px] overflow-hidden' : 'flex-1 pl-5'
        }`}
      >
        <div id="tokens" className="flex flex-col">
          <div className={`flex w-full flex-col justify-center ${isSearching ? 'flex-1' : ''}`}>
            {isSearching && (
              <div className="mt-5 flex w-full flex-1 flex-row items-center justify-center">
                <div className="mb-1 flex items-center justify-center px-0 font-bold text-slate-300">
                  <LoadingSquare size={36} className="text-sky-700" />
                </div>
              </div>
            )}
          </div>
          {topkResult && !isSearching && (
            <div className="mt-0 flex w-full flex-row flex-wrap items-center justify-start gap-x-1 sm:justify-center">
              {topkResult.results &&
                topkResult.results.map((result, i) => {
                  if (result.token === '<bos>' || result.token === '<eos>') {
                    return <div key={i} className="hidden" />;
                  }
                  return (
                    <button
                      type="button"
                      onMouseEnter={() => {
                        setHoveredTokenPosition(result.position);
                      }}
                      onMouseLeave={() => {
                        setHoveredTokenPosition(-1);
                      }}
                      onClick={() => {
                        if (lockedTokenPosition === result.position) {
                          setLockedTokenPosition(-1);
                        } else {
                          setLockedTokenPosition(i);
                        }
                      }}
                      key={result.position}
                      style={{
                        backgroundColor:
                          lockedTokenPosition === result.position
                            ? 'rgba(2,132,199,1)'
                            : hoveredTokenPosition === result.position
                            ? 'rgba(2,132,199, 0.5)'
                            : result.topFeatures.filter((f) => f.featureIndex === hoveredNeuronIndex).length > 0
                            ? 'rgba(2,132,199, 0.5)'
                            : lockedTokenPosition === -1 && hoveredTokenPosition === -1 && hoveredNeuronIndex === -1
                            ? `rgba(2,132,199,${
                                result.topFeatures && result.topFeatures.length > 0
                                  ? Math.min((result.topFeatures[0].activationValue / maxAct) ** 2, 0.8)
                                  : '0'
                              })`
                            : 'rgba(0,0,0,0)',
                        borderColor:
                          lockedTokenPosition === result.position
                            ? 'rgba(2,132,199,1)'
                            : hoveredTokenPosition === result.position
                            ? 'rgba(2,132,199, 0.5)'
                            : 'rgba(2,132,199, 0.25',
                      }}
                      className={`mb-0.5 inline-block cursor-pointer select-none rounded border px-[5px] py-[5px] text-sm font-normal text-slate-800 transition-all sm:mb-2 sm:text-[20px]
                              ${
                                lockedTokenPosition === result.position
                                  ? ' text-white'
                                  : result.topFeatures.filter((f) => f.featureIndex === hoveredNeuronIndex).length > 0
                                  ? ''
                                  : ' hover:text-sky-700'
                              } ${result.token.endsWith(' ') && result.token.length > 1 ? 'pr-2' : ''} 
                              ${result.token.startsWith(' ') && result.token.length > 1 ? 'pl-2' : ''}`}
                    >
                      {result.token.trim().length === 0 ? ' ' : result.token}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
        <div ref={scrollRef} className={`mt-3 flex w-full flex-1 flex-col overflow-y-hidden transition-all `}>
          {topkResult && !isSearching && (
            <div className="flex h-full max-h-full flex-1 flex-col items-center justify-center">
              <div className="mt-0 flex w-full flex-col gap-y-2 pb-24 sm:h-full sm:max-h-full sm:overflow-y-scroll">
                {lockedTokenPosition === -1 && hoveredTokenPosition === -1
                  ? topkFeatures?.map((f, i) => (
                      <div
                        key={i}
                        onMouseEnter={() => {
                          setHoveredNeuronIndex(f.index);
                        }}
                        onMouseLeave={() => {
                          setHoveredNeuronIndex(-1);
                        }}
                        className="group relative flex w-full flex-row items-center justify-center gap-x-3 rounded-xl bg-sky-700/5 py-0 pl-5 pr-5 text-sky-700 transition-all hover:bg-sky-700/20 sm:py-2.5"
                      >
                        <div className="flex flex-1 flex-col py-2">
                          <div className="w-full cursor-default text-[13px] transition-all group-hover:text-sky-700 sm:text-[15px]">
                            {f.feature &&
                              f.feature.explanations &&
                              f.feature.explanations.length > 0 &&
                              f.feature.explanations[0].description}

                            {/* {f.feature.index} */}
                          </div>
                        </div>
                        <div className="ml-1 flex max-w-7 flex-col items-center justify-center gap-y-1 overflow-visible py-2">
                          <ExternalLink
                            className="h-7 w-7 cursor-pointer rounded  bg-white/50 p-1.5 hover:bg-white/90"
                            onClick={() => {
                              setFeatureModalFeature(f.feature as NeuronWithPartialRelations);
                              setFeatureModalOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    ))
                  : topkResult.results[
                      lockedTokenPosition > -1 ? lockedTokenPosition : hoveredTokenPosition
                    ].topFeatures.map((f, i) => (
                      <div
                        key={i}
                        className={`group relative flex w-full cursor-default flex-row items-center justify-center gap-x-3 rounded-xl 
                                bg-sky-700/5 py-0 pl-5 pr-5 text-sky-700 
                                  transition-all hover:bg-sky-700/20   sm:py-2.5 `}
                      >
                        <div className="flex flex-1 flex-col">
                          <div className="w-full cursor-default py-2 text-[13px] transition-all group-hover:text-sky-700 sm:text-[15px]">
                            {f.feature &&
                              f.feature.explanations &&
                              f.feature.explanations.length > 0 &&
                              f.feature.explanations[0].description}
                          </div>
                        </div>
                        <div className="ml-1 flex max-w-7 flex-col items-center justify-center gap-y-1 overflow-visible py-2">
                          <ExternalLink
                            className="h-7 w-7 cursor-pointer rounded  bg-white/50 p-1.5 hover:bg-white/90"
                            onClick={() => {
                              setFeatureModalFeature(f.feature as NeuronWithPartialRelations);
                              setFeatureModalOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
