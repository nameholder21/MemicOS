import ActivationItem from '@/components/activation-item';
import { useCircuitCLT } from '@/components/provider/circuit-clt-provider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CLTFeature } from './clt-utils';

export default function CLTFeatureDetail() {
  const { visState, selectedGraph, getFeatureDetail } = useCircuitCLT();
  const [featureDetail, setFeatureDetail] = useState<CLTFeature | null>(null);
  const [overallMaxActivationValue, setOverallMaxActivationValue] = useState<number>(0);
  const activationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visState.clickedId) {
      const cNode = selectedGraph?.nodes.find((e) => e.nodeId === visState.clickedId);
      if (cNode && cNode.feature) {
        if (
          cNode.feature_type !== 'embedding' &&
          cNode.feature_type !== 'mlp reconstruction error' &&
          cNode.feature_type !== 'logit'
        ) {
          getFeatureDetail(cNode.feature).then((detail) => {
            setFeatureDetail(detail);
            setOverallMaxActivationValue(
              Math.max(...detail.examples_quantiles[0].examples.flatMap((e) => e.tokens_acts_list)),
            );
          });
        } else {
          setFeatureDetail(null);
        }
      } else {
        setFeatureDetail(null);
      }
    } else {
      setFeatureDetail(null);
    }
  }, [visState.clickedId, selectedGraph]);

  // Scroll to center the elements with 'center-me' class
  useEffect(() => {
    if (featureDetail) {
      // Add a small delay to ensure elements are fully rendered and measured correctly
      const timer = setTimeout(() => {
        const container = activationContainerRef.current;
        if (container) {
          // Find all activation item containers
          const activationItems = container.querySelectorAll('.activation-item-wrap');

          activationItems.forEach((item) => {
            // Find the center-me element within this activation item
            const centerElement = item.querySelector('.center-me');
            if (centerElement && item instanceof HTMLElement) {
              // Use getBoundingClientRect for more accurate positioning
              if (centerElement instanceof HTMLElement && item.scrollWidth > item.clientWidth) {
                const centerRect = centerElement.getBoundingClientRect();

                // Calculate the center point of the element relative to the item's left edge
                const centerElementCenter = centerRect.left + centerRect.width / 2 - item.getBoundingClientRect().left;
                const containerCenter = item.clientWidth / 2;

                // Calculate the scroll adjustment needed to center the element
                const scrollAdjustment = centerElementCenter - containerCenter;

                // Apply the scroll with offset adjustment
                item.scrollLeft = item.scrollLeft + scrollAdjustment;
              }
            }
          });
        }
      }, 100); // Slightly longer delay to ensure DOM is fully ready

      return () => clearTimeout(timer);
    }
    return () => {};
  }, [featureDetail]);

  // Memoize the feature detail content to prevent unnecessary re-rendering
  const memoizedFeatureDetail = useMemo(() => {
    if (!featureDetail) return null;

    return (
      <>
        <div className="mb-2 border-b pb-2 text-sm font-bold text-slate-600">Token Predictions</div>
        <div className="flex w-full flex-wrap items-center justify-start gap-x-1 gap-y-0.5 font-mono text-[10px] text-slate-400">
          <div className="mr-2">Top:</div>
          {featureDetail?.top_logits.map((logit, idx) => (
            <span key={idx} className="cursor-default rounded bg-slate-100 px-1 py-0.5 text-slate-700">
              {logit}
            </span>
          ))}
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-x-1 gap-y-0.5 font-mono text-[10px] text-slate-400">
          <div className="mr-2">Bottom:</div>
          {featureDetail?.bottom_logits.map((logit, idx) => (
            <span key={idx} className="cursor-default rounded bg-slate-100 px-1 py-0.5 text-slate-700">
              {logit}
            </span>
          ))}
        </div>
        <div ref={activationContainerRef} className="flex max-h-[400px] w-full flex-col overflow-y-scroll">
          {featureDetail?.examples_quantiles?.map((quantile, qIdx) => (
            <div key={qIdx} className="flex w-full flex-col gap-y-0.5">
              <div className="mb-1.5 mt-4 border-b pb-2 text-sm font-bold text-slate-600">{quantile.quantile_name}</div>
              {quantile.examples.map((example, i) => (
                <div key={i} className="flex w-full flex-col items-center">
                  <div className="activation-item-wrap max-w-full overflow-x-auto overscroll-x-none">
                    <ActivationItem
                      enableExpanding={false}
                      tokensToDisplayAroundMaxActToken={9999}
                      activation={{
                        tokens: example.tokens,
                        values: example.tokens_acts_list,
                        maxValueTokenIndex: example.tokens_acts_list.indexOf(Math.max(...example.tokens_acts_list)),
                      }}
                      overallMaxActivationValueInList={overallMaxActivationValue}
                      centerAndBorderOnTokenIndex={example.train_token_ind}
                      overrideTextSize="text-[10.5px] rounded-md leading-normal min-h-[19px]"
                      className="w-max min-w-full whitespace-nowrap"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }, [featureDetail, overallMaxActivationValue]);

  return <div className="flex min-h-[490px] w-full flex-1 flex-col gap-y-1">{memoizedFeatureDetail}</div>;
}
