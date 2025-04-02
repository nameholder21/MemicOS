'use client';

import { Card, CardContent } from '@/components/shadcn/card';
import TestGraph from './clt-link-graph';
import CLTNodeConnections from './clt-node-connections';
import CLTModelPromptSelector from './model-prompt-selector';

export default function CLTWrapper() {
  return (
    <div className="mt-8 flex w-full max-w-screen-xl flex-col px-2 text-slate-700">
      <div className="mb-1 w-full text-center text-base font-medium text-slate-500 text-slate-600">
        Circuit Tracing <sup className="text-xs">alpha</sup>
      </div>
      <CLTModelPromptSelector />

      <Card className="mt-5 w-full bg-white">
        <CardContent className="p-0">
          <div className="flex w-full flex-row gap-x-2 px-5 pl-8">
            <TestGraph />
            <CLTNodeConnections />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
