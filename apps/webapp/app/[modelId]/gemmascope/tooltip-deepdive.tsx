"use client";

import CustomTooltip from "../../../components/custom-tooltip";

export default function DeepDiveTooltip({ children }: { children: React.ReactNode }) {
  return (
    <CustomTooltip
      trigger={
        <div className="flex h-6 w-12 cursor-pointer flex-row items-center justify-center rounded-full bg-gGreen py-2 text-center text-[11px] font-bold uppercase text-white transition-all hover:bg-gGreen/70 sm:mt-3">
          <span className="text-[15px]">🧑‍🔬</span>
        </div>
      }
    >
      {children}
    </CustomTooltip>
  );
}
