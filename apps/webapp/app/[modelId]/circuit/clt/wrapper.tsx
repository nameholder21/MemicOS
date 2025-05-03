'use client';

import { useCircuitCLT } from '@/components/provider/circuit-clt-provider';
import { LoadingSquare } from '@/components/svg/loading-square';
import CLTFeatureDetail from './clt-feature-detail';
import CLTLinkGraph from './clt-link-graph';
import CLTNodeConnections from './clt-node-connections';
import CLTSubgraph from './clt-subgraph';
import GraphTools from './graph-tools';

export default function CLTWrapper() {
  const { isLoadingGraphData, selectedMetadataGraph } = useCircuitCLT();
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
          {/* <div className="mb-0 w-full text-center text-[11px] text-red-500">
            This is a work in progress and not linked to from public MemicOS pages.
          </div> */}
          <GraphTools />
        </div>

        <div className="mb-2 w-full">
          {/* <Card className="mb-5 mt-2 w-full bg-white">
          <CardContent className="py-6 pt-3"> */}
          {isLoadingGraphData ? (
            <div className="flex h-full min-h-[800px] w-full items-center justify-center">
              <LoadingSquare className="h-6 w-6" />
            </div>
          ) : selectedMetadataGraph ? (
            <>
              <div className="flex w-full flex-row gap-x-2">
                <CLTLinkGraph />
                <CLTNodeConnections />
              </div>
              <div className="flex w-full flex-row gap-x-4">
                <div className="w-[53%] min-w-[53%] max-w-[53%]">
                  <CLTSubgraph />
                </div>
                <div className="w-[45%] min-w-[45%] overflow-hidden">
                  <CLTFeatureDetail />
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
        {/* </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
