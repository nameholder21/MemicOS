"use client";

import CustomTooltip from "@/components/custom-tooltip";

export default function WarningTooltip({ children }: { children: React.ReactNode }) {
  return (
    <CustomTooltip
      trigger={
        <div className="flex h-6 w-12 cursor-pointer  flex-row items-center justify-center rounded-full border-gBlue bg-gBlue py-2 text-center text-[11px] font-bold uppercase transition-all hover:bg-gBlue/70 hover:text-gBlue sm:mt-3">
          <span className="text-[15px]">❕</span>
        </div>
      }
    >
      {children}
    </CustomTooltip>
  );
}
