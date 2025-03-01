/* eslint-disable react/jsx-props-no-spreading */

'use client';

import * as OldTooltip from '@radix-ui/react-tooltip';
import { ReactNode, useState } from 'react';

export default function Tooltip({ alwaysOpen, children }: { alwaysOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <OldTooltip.Root open={alwaysOpen || open} delayDuration={0} onOpenChange={setOpen}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span onClick={() => setOpen(true)} className="inline-block">
        {children}
      </span>
    </OldTooltip.Root>
  );
}
