'use client';

import { Card, CardContent } from '@/components/shadcn/card';
import CLTFeatureDetail from './clt-feature-detail';
import TestGraph from './clt-link-graph';
import CLTNodeConnections from './clt-node-connections';
import CLTModelPromptSelector from './model-prompt-selector';

export default function CLTWrapper() {
  return (
    <div className="mt-8 flex w-full max-w-screen-xl flex-col px-2 text-slate-700">
      <div className="mb-1 w-full text-center text-base font-medium text-slate-500 text-slate-600">
        Circuit Tracing <sup className="text-xs">alpha</sup>
      </div>
      <div className="mb-2 w-full text-center text-[11px] text-red-500">
        This is a work in progress and not linked to from public MemicOS pages.
      </div>
      <CLTModelPromptSelector />

      <Card className="mb-10 mt-5 w-full bg-white">
        <CardContent className="py-6 pt-3">
          <div className="flex w-full flex-row gap-x-2 pl-2">
            <TestGraph />
            <CLTNodeConnections />
          </div>
          <div className="flex w-full flex-row gap-x-2 pl-2">
            <div className="mt-3 min-h-[490px] w-[55%] min-w-[55%] max-w-[55%]" />
            <div className="w-[45%] min-w-[45%] overflow-hidden">
              <CLTFeatureDetail />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
