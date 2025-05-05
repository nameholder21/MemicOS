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
    <div className="flex max-h-[360px] flex-1 flex-col gap-y-0.5 overflow-y-scroll overscroll-none pb-1 pl-1 text-slate-800">
      <div className="sticky top-0 bg-white pb-0.5 text-[10px] font-medium uppercase text-slate-500">{title}</div>
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
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                // If control or command key is pressed, add to pinnedIds
                updateVisStateField('pinnedIds', [...(visState.pinnedIds || []), node.nodeId]);
              } else {
                // Otherwise just set as clicked
                updateVisStateField('clickedId', node.nodeId);
              }
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExpanded, setIsExpanded] = useState(true);

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
    <div
      className={`${isExpanded ? 'flex-1' : ''} node-connections relative mt-2 flex max-h-[420px] min-h-[420px] max-w-[420px] flex-row overflow-y-hidden rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm transition-all`}
    >
      {/* <div className="mb-2 mt-1 flex w-full flex-row items-center justify-start gap-x-2 pl-1">
        <div className="text-xs font-bold text-slate-600">Node Connections</div>
      </div> */}
      {/* <div className="h-[100%] w-5 min-w-5 max-w-5 border-r border-slate-200">
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </Button>
      </div> */}
      <div className={`w-full flex-col text-slate-700 ${isExpanded ? 'flex' : 'hidden'}`}>
        {clickedNode ? (
          <div className="flex flex-row items-center gap-x-2 pl-1 text-xs font-medium text-slate-600">
            {!clickedNode?.featureDetailNP && <div className="">F#{clickedNode?.feature}</div>}
            <Circle className="h-3.5 max-h-3.5 min-h-3.5 w-3.5 min-w-3.5 max-w-3.5 text-[#f0f]" />
            <div className="flex-1 leading-tight">{getOverrideClerpForNode(clickedNode)}</div>
            <NpFeatureLink selectedGraph={selectedGraph} node={clickedNode} />
          </div>
        ) : (
          <div className="flex h-[100%] flex-col items-center justify-center text-center text-sm font-medium text-slate-700">
            <div className="mb-2 text-lg font-bold">Node Connections</div>
            <div className="">Click a node on the left to see its connections.</div>
          </div>
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
