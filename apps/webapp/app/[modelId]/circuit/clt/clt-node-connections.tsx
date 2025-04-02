import CustomTooltip from '@/components/custom-tooltip';
import { useCircuitCLT } from '@/components/provider/circuit-clt-provider';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CLTGraphNode } from './clt-utils';

export default function CLTNodeConnections() {
  const { visState, selectedGraph } = useCircuitCLT();

  const [clickedNode, setClickedNode] = useState<CLTGraphNode | null>(null);

  useEffect(() => {
    if (visState.clickedId) {
      const cNode = selectedGraph?.nodes.find((e) => e.nodeId === visState.clickedId);
      if (cNode) {
        setClickedNode(cNode);
      }
    } else {
      setClickedNode(null);
    }
  }, [visState.clickedId]);

  return (
    <div className="node-connections relative mt-3 min-h-[490px] flex-1">
      <div className="mb-3 mt-2 flex w-full flex-row items-center justify-start gap-x-2">
        <div className="text-sm font-bold text-slate-500">Node Connections</div>
        <CustomTooltip wide trigger={<QuestionMarkCircledIcon className="h-4 w-4 text-slate-500" />}>
          <div className="flex flex-col">
            TODO: https://transformer-circuits.pub/2025/attribution-graphs/methods.html
          </div>
        </CustomTooltip>
      </div>
      <div className="flex w-full flex-col text-slate-700">
        {clickedNode ? (
          <div className="flex flex-row items-center gap-x-2 text-sm font-medium text-slate-600">
            <div className="">F#{clickedNode?.feature}</div>
            <Circle className="h-3.5 w-3.5 text-[#f0f]" />
            <div>{clickedNode?.ppClerp}</div>
          </div>
        ) : (
          <div className="text-sm font-medium text-slate-500">Click a feature on the left for details</div>
        )}
        {clickedNode && (
          <div className="mt-2 flex w-full flex-row gap-x-4">
            <div className="forceShowScrollBar flex max-h-[360px] flex-1 flex-col gap-y-0.5 overflow-y-scroll pr-1">
              <div className="sticky top-0 bg-white pb-1 text-sm font-medium text-slate-600">Input Features</div>
              {selectedGraph?.nodes
                ?.toSorted((a, b) => (b.tmpClickedSourceLink?.pctInput ?? 0) - (a.tmpClickedSourceLink?.pctInput ?? 0))
                .filter(
                  (node) =>
                    node.tmpClickedSourceLink?.pctInput !== null && node.tmpClickedSourceLink?.pctInput !== undefined,
                )
                .map((node) => (
                  <div
                    key={node.nodeId}
                    className="flex cursor-pointer flex-row items-center justify-between gap-x-2 rounded bg-slate-50 px-2 py-0.5 text-[10px] hover:bg-sky-100"
                  >
                    <div>{node.ppClerp}</div>
                    {node.tmpClickedSourceLink?.pctInput !== null && node.tmpClickedSourceLink?.pctInput !== undefined
                      ? node.tmpClickedSourceLink?.pctInput > 0
                        ? `+${node.tmpClickedSourceLink?.pctInput?.toFixed(3)}`
                        : node.tmpClickedSourceLink?.pctInput?.toFixed(3)
                      : ''}
                  </div>
                ))}
            </div>
            <div className="forceShowScrollBar flex max-h-[360px] flex-1 flex-col gap-y-0.5 overflow-y-scroll pr-1">
              <div className="sticky top-0 bg-white pb-1 text-sm font-medium text-slate-600">Output Features</div>
              {selectedGraph?.nodes
                ?.toSorted((a, b) => (b.tmpClickedTargetLink?.pctInput ?? 0) - (a.tmpClickedTargetLink?.pctInput ?? 0))
                .filter(
                  (node) =>
                    node.tmpClickedTargetLink?.pctInput !== null && node.tmpClickedTargetLink?.pctInput !== undefined,
                )
                .map((node) => (
                  <div
                    key={node.nodeId}
                    className="flex cursor-pointer flex-row items-center justify-between gap-x-2 rounded bg-slate-50 px-2 py-0.5 text-[10px] hover:bg-sky-100"
                  >
                    <div>{node.ppClerp}</div>
                    {node.tmpClickedTargetLink?.pctInput !== null && node.tmpClickedTargetLink?.pctInput !== undefined
                      ? node.tmpClickedTargetLink?.pctInput > 0
                        ? `+${node.tmpClickedTargetLink?.pctInput?.toFixed(3)}`
                        : node.tmpClickedTargetLink?.pctInput?.toFixed(3)
                      : ''}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
