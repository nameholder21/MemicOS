'use client';

import * as OldTooltip from '@radix-ui/react-tooltip';
import Tooltip from './shadcn/tooltip';

export default function CustomTooltip({
  trigger,
  wide = false,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <OldTooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <Tooltip alwaysOpen={false}>
        <OldTooltip.Trigger asChild>{trigger}</OldTooltip.Trigger>
        <OldTooltip.Portal>
          <OldTooltip.Content
            className={`z-50 rounded-lg border border-slate-200 bg-white px-5 py-3.5  text-xs text-slate-600 shadow ${
              wide ? 'max-w-[640px]' : 'max-w-[320px] '
            }`}
            sideOffset={3}
          >
            {children}
          </OldTooltip.Content>
        </OldTooltip.Portal>
      </Tooltip>
    </OldTooltip.Provider>
  );
}
