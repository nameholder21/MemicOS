import ActivationItem from '@/components/activation-item';
import FeatureStats from '@/components/feature-stats';
import { useGlobalContext } from '@/components/provider/global-provider';
import { InferenceActivationAllResult } from '@/components/provider/inference-activation-all-provider';
import { replaceHtmlAnomalies } from '@/lib/utils/activations';
import { ExplanationPartialWithRelations } from '@/prisma/generated/zod';

export default function ResultItem({
  result,
  tokens,
  topExplanation,
  searchSortIndexes,
  showDashboards,
}: {
  result: InferenceActivationAllResult;
  tokens: string[];
  topExplanation: ExplanationPartialWithRelations | undefined;
  searchSortIndexes: number[];
  showDashboards: boolean;
}) {
  const { getSourceSet } = useGlobalContext();
  return (
    <a
      href={`/${result.modelId}/${result.layer}/${result.index}`}
      target="_blank"
      rel="noreferrer"
      key={result.index}
      className="group flex w-full cursor-pointer flex-col items-center justify-center border-b border-slate-100 bg-white px-3 py-5 sm:px-5"
    >
      <div className="flex w-full max-w-screen-lg flex-col items-start justify-center gap-x-2 sm:flex-row sm:gap-x-5">
        <div className="flex basis-4/12 flex-col items-center justify-start font-mono text-[11px] font-medium text-slate-500 sm:basis-3/12">
          <span
            className={`mb-1 mt-0 flex flex-col font-sans leading-tight ${
              topExplanation ? 'text-[12px] text-slate-700 sm:text-sm' : 'text-[12px] text-slate-500 sm:text-xs'
            }`}
          >
            {topExplanation ? (
              topExplanation.description
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-0.5 text-center">
                <div>No Explanation</div>
              </div>
            )}
          </span>
          <span className="mb-2.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase text-slate-600 group-hover:bg-sky-200 sm:mb-1 sm:text-xs">
            {result.layer}:{result.index}
          </span>
        </div>
        <div className="flex basis-8/12 flex-col sm:basis-9/12">
          <div className={`mt-0 flex ${searchSortIndexes.length > 0 ? 'flex-col' : 'flex-row items-center'} gap-x-2`}>
            {searchSortIndexes.length > 0 ? (
              <div className="mb-1.5 flex max-w-screen-md flex-row gap-x-1 overflow-x-scroll">
                {searchSortIndexes.length > 1 && (
                  <div className="sticky left-0 flex flex-col items-center justify-center gap-y-0.5 bg-white pr-1">
                    <div className="px-1 text-[10px] font-bold uppercase text-slate-400">Sum</div>
                    <span className="mt-0 text-[11px] text-emerald-700">
                      {searchSortIndexes
                        .map((index) => result.values[index])
                        .reduce((a, b) => a + b, 0)
                        .toFixed(1)}
                    </span>
                  </div>
                )}
                {searchSortIndexes.map((searchSortIndex) => (
                  <div key={searchSortIndex} className="flex flex-col items-center justify-center gap-y-0.5">
                    <div className="whitespace-pre rounded bg-slate-200 px-1 font-mono text-xs font-medium">
                      {replaceHtmlAnomalies(tokens[searchSortIndex])}
                    </div>
                    <span className="mt-0 text-[11px] text-emerald-700">
                      {result.values[searchSortIndex].toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-y-0.5 px-2 text-xs text-slate-700">
                <div className="whitespace-pre rounded bg-slate-200 px-1 font-mono font-medium">
                  {replaceHtmlAnomalies(tokens[result.maxValueIndex])}
                </div>
                <span className="mt-0 text-[11px] text-emerald-700">{result.maxValue.toFixed(1)}</span>
              </div>
            )}
            <ActivationItem
              showLineBreaks={false}
              activation={{
                values: result.values,
                tokens,
                maxValueTokenIndex: result.maxValueIndex,
                maxValue: result.maxValue,
                dfaValues: result.dfaValues,
                dfaMaxValue: result.dfaMaxValue,
                dfaTargetIndex: result.dfaTargetIndex,
              }}
              enableExpanding={false}
              overrideLeading="leading-none"
              overrideTextSize="text-xs"
              dfa={getSourceSet(result.neuron?.modelId || '', result.neuron?.sourceSetName || '')?.showDfa}
            />
          </div>

          {showDashboards && result.neuron && (
            <div className="mt-3 flex flex-col rounded-md border border-slate-200 px-3 pb-3">
              {result.neuron && result.neuron.activations && result.neuron.activations[0] && (
                <>
                  <div className="mb-0.5 mt-3 text-left text-[12px] font-bold uppercase text-slate-600">
                    Top Activation
                  </div>
                  <div className="mt-1 flex flex-row gap-x-2">
                    {result.neuron.activations &&
                      result.neuron.activations.length > 0 &&
                      result.neuron.activations[0].tokens &&
                      result.neuron.activations[0].values && (
                        <div className="flex flex-col items-center gap-y-0.5 px-2 text-xs text-slate-700">
                          <span className="whitespace-pre rounded bg-slate-200 px-1 font-mono font-medium">
                            {replaceHtmlAnomalies(
                              result.neuron.activations[0].tokens[result.neuron.activations[0].maxValueTokenIndex || 0],
                            )}
                          </span>
                          <span className="mt-0 text-[11px] text-emerald-700">
                            {result.neuron.activations[0].values[
                              result.neuron.activations[0].maxValueTokenIndex || 0
                            ].toFixed(1)}
                          </span>
                        </div>
                      )}
                    <ActivationItem
                      showLineBreaks={false}
                      activation={{
                        values: result.neuron.activations[0].values,
                        tokens: result.neuron.activations[0].tokens,
                        maxValueTokenIndex: result.neuron.activations[0].maxValueTokenIndex,
                        maxValue: result.neuron.activations[0].maxValue,
                        dfaValues: result.neuron.activations[0].dfaValues,
                        dfaMaxValue: result.neuron.activations[0].dfaMaxValue,
                        dfaTargetIndex: result.neuron.activations[0].dfaTargetIndex,
                      }}
                      enableExpanding={false}
                      tokensToDisplayAroundMaxActToken={10}
                      overrideLeading="leading-none"
                      overrideTextSize="text-xs"
                      dfa={getSourceSet(result.neuron?.modelId, result.neuron?.sourceSetName || '')?.showDfa}
                    />
                  </div>
                </>
              )}

              {result.neuron?.pos_str && result.neuron?.pos_str.length > 0 && (
                <div className="pointer-events-none mb-0 mt-2 pt-2">
                  <FeatureStats currentNeuron={result.neuron} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
