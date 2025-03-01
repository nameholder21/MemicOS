'use client';

import ExplanationScoreDetailDialog from '@/components/explanation-score-detail-dialog';
import { useExplanationScoreDetailContext } from '@/components/provider/explanation-score-detail-provider';
import { useGlobalContext } from '@/components/provider/global-provider';
import {
  ExplanationScoreTypeWithPartialRelations,
  ExplanationScoreWithPartialRelations,
  ExplanationWithPartialRelations,
  NeuronWithPartialRelations,
} from '@/prisma/generated/zod';

export default function RecentScores({
  explanationScoreType,
}: {
  explanationScoreType: ExplanationScoreTypeWithPartialRelations;
}) {
  const { setFeatureModalFeature, setFeatureModalOpen } = useGlobalContext();
  const { loadExplanationScoreDetail } = useExplanationScoreDetailContext();

  return (
    <div className="mt-2 grid w-full grid-cols-2 gap-x-3 gap-y-3 text-sm">
      <ExplanationScoreDetailDialog />
      {explanationScoreType.explanationScores?.map((explanationScore) => (
        <div
          key={explanationScore.id}
          className="col-span-1 flex flex-row items-center justify-between gap-x-4 rounded-lg border border-slate-200 px-5 py-3"
        >
          <div className="flex flex-1 flex-col items-start gap-y-2">
            <div className="text-[13px] font-medium leading-snug text-slate-600">
              {explanationScore.explanation?.description}
            </div>
            <button
              type="button"
              className="flex shrink-0 cursor-pointer flex-row items-center gap-x-1 whitespace-nowrap rounded bg-slate-100 px-[8px] py-[6px] text-[9px] font-medium leading-none text-slate-500 hover:bg-sky-200 hover:text-sky-700 sm:px-2.5 sm:py-1.5 sm:text-[10px]"
              onClick={() => {
                setFeatureModalFeature({
                  modelId: explanationScore.explanation?.modelId ?? '',
                  layer: explanationScore.explanation?.layer ?? '',
                  index: explanationScore.explanation?.index ?? '',
                } as NeuronWithPartialRelations);
                setFeatureModalOpen(true);
              }}
            >
              <div className="flex flex-row gap-x-1 gap-y-[3px] leading-snug">
                {explanationScore.explanation?.modelId?.toUpperCase()}
                <br />
                {explanationScore.explanation?.layer?.toUpperCase()}
                <br />
                Index {explanationScore.explanation?.index?.toUpperCase()}
              </div>
            </button>
          </div>
          <div className="flex h-[70px] w-[70px] flex-col items-center justify-center gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => {
                loadExplanationScoreDetail(
                  explanationScore.explanation as ExplanationWithPartialRelations,
                  explanationScore as ExplanationScoreWithPartialRelations,
                );
              }}
              className="flex aspect-square h-[60px] max-h-[60px] min-h-[60px] w-[60px] min-w-[60px] max-w-[60px] cursor-pointer items-center justify-center rounded-2xl bg-sky-200 p-4 text-lg leading-none transition-all hover:bg-sky-300 hover:text-sky-800"
            >
              {((explanationScore.value || 0) * 100).toFixed(0)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
