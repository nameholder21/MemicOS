'use client';

import * as RadixToast from '@radix-ui/react-toast';
import { useGlobalContext } from './provider/global-provider';

export default function Toast() {
  const { toastOpen, setToastOpen, toastMessage } = useGlobalContext();
  return (
    <>
      <RadixToast.Root
        className="data-[swipe=end]:animate-swipeOut grid animate-fade-down cursor-default select-none grid-cols-[auto_max-content] items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 shadow animate-once animate-ease-in-out data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[swipe=cancel]:transition-[transform_200ms_ease-out] sm:px-5 sm:py-2"
        open={toastOpen}
        onOpenChange={setToastOpen}
      >
        <RadixToast.Title className="text-center text-[10px] font-medium text-slate-500 sm:text-sm">
          {toastMessage}
        </RadixToast.Title>
      </RadixToast.Root>
      <RadixToast.Viewport className="fixed inset-x-0 top-0 z-[2147483647] m-0 mx-auto flex w-full min-w-[300px] max-w-[97vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_5px] sm:w-fit sm:[--viewport-padding:_10px]" />
    </>
  );
}
