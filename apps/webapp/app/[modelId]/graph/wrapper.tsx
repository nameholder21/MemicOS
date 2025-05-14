'use client';

import { useGraphContext } from '@/components/provider/graph-provider';
import { LoadingSquare } from '@/components/svg/loading-square';
import GraphFeatureDetail from './feature-detail';
import GraphToolbar from './graph-toolbar';
import LinkGraph from './link-graph';
import GraphNodeConnections from './node-connections';
import Subgraph from './subgraph';

export default function GraphWrapper() {
  const { isLoadingGraphData, selectedMetadataGraph, loadingGraphLabel } = useGraphContext();
  return (
    <div className="mt-1 flex w-full flex-col justify-center px-4 text-slate-700">
      <div className="flex w-full flex-col items-center justify-center sm:hidden">
        <div className="mb-2 w-full pt-8 text-center text-sm text-red-500">
          Sorry, this page is not optimized for mobile. Please visit this link on a desktop browser.
        </div>
      </div>
      <div className="hidden w-full flex-col items-center justify-center sm:flex">
        {/* <div>{JSON.stringify(visState)}</div> */}
        <div className="flex w-full flex-col">
          <GraphToolbar />
        </div>

        <div className="mb-2 w-full">
          {isLoadingGraphData ? (
            <div className="flex h-full min-h-[800px] w-full flex-col items-center justify-center gap-y-3">
              <LoadingSquare className="h-6 w-6" />
              <div className="text-sm text-slate-400">
                {loadingGraphLabel.length > 0 ? loadingGraphLabel : 'Loading...'}
              </div>
            </div>
          ) : selectedMetadataGraph ? (
            <>
              <div className="flex w-full flex-row">
                <LinkGraph />
                <GraphNodeConnections />
              </div>
              <div className="flex w-full flex-row">
                <div className="w-[53%] min-w-[53%] max-w-[53%]">
                  <Subgraph />
                </div>
                <div className="flex-1 overflow-hidden">
                  <GraphFeatureDetail />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[500px] w-full items-center justify-center">
              <div className="text-center text-lg text-slate-400">
                No graph selected. Choose one from the dropdown above.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
