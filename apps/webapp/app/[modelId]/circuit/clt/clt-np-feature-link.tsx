import { useGlobalContext } from '@/components/provider/global-provider';
import { Button } from '@/components/shadcn/button';
import { ArrowUpRightFromSquare } from 'lucide-react';
import {
  ANT_MODEL_ID_TO_MEMICOS_MODEL_ID,
  CLTGraph,
  CLTGraphNode,
  getIndexFromAnthropicFeatureId,
  getLayerFromAnthropicFeatureId,
  MODEL_HAS_MEMICOS_DASHBOARDS,
} from './clt-utils';

export default function NpFeatureLink({ selectedGraph, node }: { selectedGraph: CLTGraph | null; node: CLTGraphNode }) {
  const { setFeatureModalFeature, setFeatureModalOpen } = useGlobalContext();

  if (!selectedGraph) {
    return null;
  }
  return selectedGraph?.metadata.scan &&
    MODEL_HAS_MEMICOS_DASHBOARDS.has(selectedGraph?.metadata.scan) &&
    node.featureDetailNP ? (
    <div className="ml-1 flex flex-col gap-x-1 pl-0">
      <Button
        onClick={() => {
          if (node.featureDetailNP) {
            setFeatureModalFeature(node.featureDetailNP);
            setFeatureModalOpen(true);
          }
        }}
        className="flex min-w-[120px] shrink-0 flex-row items-center gap-x-1 whitespace-nowrap rounded-md bg-slate-200 px-[8px] py-[6px] text-[9px] font-medium leading-none text-slate-600 shadow-none hover:bg-sky-200 hover:text-sky-700 sm:mr-0 sm:px-3 sm:py-1.5 sm:pr-2.5 sm:text-[10px]"
      >
        <div className="flex flex-col gap-y-[3px] font-mono font-medium">
          <div className="">
            LAYER{' '}
            {getLayerFromAnthropicFeatureId(
              // @ts-ignore
              ANT_MODEL_ID_TO_MEMICOS_MODEL_ID[selectedGraph?.metadata.scan],
              node.feature,
            )}
          </div>
          <div className="">
            INDEX{' '}
            {getIndexFromAnthropicFeatureId(
              // @ts-ignore
              ANT_MODEL_ID_TO_MEMICOS_MODEL_ID[selectedGraph?.metadata.scan],
              node.feature,
            )}
          </div>
        </div>
        <ArrowUpRightFromSquare className="ml-1 h-4 w-4" />
      </Button>
    </div>
  ) : (
    <div className="">F# {node.feature}</div>
  );
}
