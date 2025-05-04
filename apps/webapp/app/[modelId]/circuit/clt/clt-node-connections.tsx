import { useCircuitCLT } from '@/components/provider/circuit-clt-provider';
import { Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import NpFeatureLink from './clt-np-feature-link';
import { CLTGraphNode, CltVisState, featureTypeToText } from './clt-utils';

function FeatureList({
  title,
  nodes,
  linkType,
  visState,
  updateVisStateField,
  isEditingLabel,
  getOverrideClerpForNode,
}: {
  title: string;
  nodes: CLTGraphNode[];
  linkType: 'source' | 'target';
  visState: any;
  updateVisStateField: (field: keyof CltVisState, value: any) => void;
  isEditingLabel: boolean;
  getOverrideClerpForNode: (node: CLTGraphNode) => string | undefined;
}) {
  const linkProp = linkType === 'source' ? 'tmpClickedSourceLink' : 'tmpClickedTargetLink';

  return (
    <div className="flex max-h-[332px] flex-1 flex-col gap-y-0.5 overflow-y-scroll px-1 pb-1 text-slate-800">
      <div className="sticky top-0 pb-1 text-xs font-medium text-slate-600">{title}</div>
      {nodes
        ?.toSorted((a, b) => (b[linkProp]?.pctInput ?? 0) - (a[linkProp]?.pctInput ?? 0))
        .filter((node) => node[linkProp]?.pctInput !== null && node[linkProp]?.pctInput !== undefined)
        .map((node, idx) => (
          <button
            type="button"
            key={`${node.featureId}-${idx}`}
            className={`flex cursor-pointer flex-row items-center justify-between gap-x-1.5 rounded bg-slate-50 px-2 py-[3px] text-[10px] hover:bg-sky-100 ${
              node.featureId === visState.hoveredId ? 'z-20 outline-dotted outline-[3px] outline-[#f0f]' : ''
            } ${(node[linkProp]?.pctInput ?? 0) > 0.25 || (node[linkProp]?.pctInput ?? 0) < -0.25 ? 'text-white' : ''}`}
            style={{ backgroundColor: node[linkProp]?.tmpColor }}
            onMouseEnter={() => {
              if (!isEditingLabel) {
                updateVisStateField('hoveredId', node.featureId);
              }
            }}
            onMouseLeave={() => {
              updateVisStateField('hoveredId', null);
            }}
            onClick={() => {
              updateVisStateField('clickedId', node.nodeId);
            }}
          >
            <svg width={10} height={14} className="mr-0 inline-block">
              <g>
                <g
                  className={`default-icon block fill-none ${(node[linkProp]?.pctInput ?? 0) > 0.25 || (node[linkProp]?.pctInput ?? 0) < -0.25 ? 'stroke-white' : 'stroke-slate-800'} ${node.nodeId && visState.pinnedIds?.includes(node.nodeId) ? 'stroke-[1.7]' : 'stroke-[0.7]'}`}
                >
                  <text fontSize={15} textAnchor="middle" dominantBaseline="central" dx={5} dy={5}>
                    {featureTypeToText(node.feature_type)}
                  </text>
                </g>
              </g>
            </svg>
            <div className="flex-1 text-left leading-snug">{getOverrideClerpForNode(node)}</div>
            {node[linkProp]?.tmpClickedCtxOffset !== undefined &&
              (node[linkProp]?.tmpClickedCtxOffset > 0 ? (
                <div>→</div>
              ) : node[linkProp]?.tmpClickedCtxOffset < 0 ? (
                <div>←</div>
              ) : (
                ''
              ))}
            <div className="font-mono">{node.layer !== 'E' ? `L${node.layer}` : ''}</div>
            <div className="font-mono">
              {node[linkProp]?.pctInput !== null && node[linkProp]?.pctInput !== undefined
                ? node[linkProp]?.pctInput > 0
                  ? `+${node[linkProp]?.pctInput?.toFixed(3)}`
                  : node[linkProp]?.pctInput?.toFixed(3)
                : ''}
            </div>
          </button>
        ))}
    </div>
  );
}

export default function CLTNodeConnections() {
  const { visState, selectedGraph, updateVisStateField, isEditingLabel, getOverrideClerpForNode } = useCircuitCLT();

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
  }, [visState.clickedId, selectedGraph]);

  return (
    <div className="node-connections relative mt-2 min-h-[320px] flex-1">
      <div className="mb-2 mt-1 flex w-full flex-row items-center justify-start gap-x-2 px-1">
        <div className="text-xs font-bold text-slate-600">Node Connections</div>
        {/* <CustomTooltip wide trigger={<QuestionMarkCircledIcon className="h-4 w-4 text-slate-500" />}>
          <div className="flex flex-col">
            TODO: https://transformer-circuits.pub/2025/attribution-graphs/methods.html
          </div>
        </CustomTooltip> */}
      </div>
      <div className="flex w-full flex-col text-slate-700">
        {clickedNode ? (
          <div className="flex flex-row items-center gap-x-2 px-1 text-xs font-medium text-slate-600">
            <div className="">F#{clickedNode?.feature}</div>
            <Circle className="h-3.5 max-h-3.5 min-h-3.5 w-3.5 min-w-3.5 max-w-3.5 text-[#f0f]" />
            <div>{getOverrideClerpForNode(clickedNode)}</div>
            <NpFeatureLink selectedGraph={selectedGraph} node={clickedNode} />
          </div>
        ) : (
          <div className="px-1 text-sm font-medium text-slate-500">Click a node on the left to see connections.</div>
        )}
        {clickedNode && (
          <div className="mt-2 flex w-full flex-row gap-x-0">
            <FeatureList
              title="Input Features"
              nodes={selectedGraph?.nodes || []}
              linkType="source"
              visState={visState}
              updateVisStateField={updateVisStateField}
              isEditingLabel={isEditingLabel}
              getOverrideClerpForNode={getOverrideClerpForNode}
            />
            <FeatureList
              title="Output Features"
              nodes={selectedGraph?.nodes || []}
              linkType="target"
              visState={visState}
              updateVisStateField={updateVisStateField}
              isEditingLabel={isEditingLabel}
              getOverrideClerpForNode={getOverrideClerpForNode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
