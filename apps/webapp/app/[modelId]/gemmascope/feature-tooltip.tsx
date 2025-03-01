'use client';

import CustomTooltip from '../../../components/custom-tooltip';

export default function FeatureTooltip({ s = true }: { s?: boolean }) {
  return (
    <CustomTooltip
      trigger={
        <span className="ml-0.5 mr-0.5 flex cursor-pointer flex-row gap-x-0.5 border-b border-dashed border-gGreen font-bold leading-none text-gGreen">
          feature{s ? 's' : ''}
        </span>
      }
    >
      <>
        AI models are inspired by the human brain - they both have {`"neuron"`} building blocks.
        <br />
        <br />
        Given a prompt, several combinations of neurons fire, sometimes overlapping - these combinations are called{' '}
        <strong>features</strong>.
        <br />
        <br />
        A feature fires on specific concepts or ideas.
        <br />
        <br />
        For example, if you send Gemma a message that said {`"I like cats!"`}, it would cause a feature about {`"cats"`}{' '}
        to activate.
        <br />
        <br />
        {`Here's an example feature:`}
        <br />
        <div className="group relative mb-0 mt-1 flex w-full flex-row items-center justify-center gap-x-3 rounded-xl bg-emerald-100 px-5 py-1 text-emerald-800 transition-all hover:bg-emerald-200">
          <div className="h-2 w-2 rounded-full bg-emerald-700" />
          <div className=" flex flex-1 flex-col ">
            <div className="cursor-default pb-0.5 pt-3 text-xs leading-none transition-all group-hover:text-emerald-800">
              references to London
            </div>
            <div className="pb-3 text-[7px] leading-none">Feature Label/Description</div>
          </div>
        </div>
      </>
    </CustomTooltip>
  );
}
