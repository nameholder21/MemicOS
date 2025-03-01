import DeepDiveTooltip from '@/app/[modelId]/gemmascope/tooltip-deepdive';
import WarningTooltip from '@/app/[modelId]/gemmascope/tooltip-warning';
import CustomTooltip from '@/components/custom-tooltip';

export const blogPostLink =
  'https://deepmind.google/discover/blog/gemma-scope-helping-the-safety-community-shed-light-on-the-inner-workings-of-language-models';
export const codingTutorialLink =
  'https://colab.research.google.com/drive/17dQFYUYnuKnP6OwQPH9v_GSYUW5aj-Rp?usp=sharing';
export const hfLink = 'https://huggingface.co/google/gemma-scope';
export const techReportLink = 'https://storage.googleapis.com/gemma-scope/gemma-scope-report.pdf';

export default function TabMain({
  tabUpdater,
  completedTabsAdd,
}: {
  tabUpdater: (tab: string) => void;
  completedTabsAdd: (tab: string) => void;
}) {
  return (
    <div className="relative mt-0 flex h-full w-full max-w-screen-xl flex-col items-center justify-start bg-white pb-24 pt-1">
      <div className="mt-2 flex w-full flex-row items-center justify-start gap-x-2 px-3 text-2xl font-bold text-slate-600 sm:mt-2 sm:justify-center sm:text-3xl">
        Exploring
        <div className="inline-block bg-gradient-to-r from-gBlue to-gGreen bg-clip-text text-transparent">
          Gemma Scope
        </div>
      </div>
      <div className="mb-8 mt-1.5 px-3 text-sm font-medium text-slate-500 sm:mb-8 sm:px-0">
        An Introduction to AI Interpretability and the Inner Workings of Gemma 2 2B
      </div>
      <div className="mb-10 flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded px-3 py-1 sm:flex-row sm:px-7">
        <div className="flex w-[105px] min-w-[105px] max-w-[105px] flex-row items-center gap-x-2 sm:flex-col">
          <span className="max-w-[105px]whitespace-nowrap w-[105px] min-w-[105px] rounded-full bg-slate-100 px-3 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
            👋 Hello!
          </span>
        </div>

        <div className=" flex w-full flex-col items-start justify-start text-left text-sm font-medium text-slate-600">
          <div className="leading-normal">
            The inner workings of modern AIs are a mystery. {`This is because AIs are language models that are`}{' '}
            <strong>grown, not designed</strong>.
          </div>
          <div className="mt-2 leading-normal">
            <strong>The science of understanding what happens inside AI is called interpretability.</strong>{' '}
          </div>
          <div className="mt-2 leading-normal">
            This demo is a beginner-friendly introduction to interpretability that explores an AI model called Gemma 2
            2B. It also contains interesting and relevant content even for those already familiar with the topic.
          </div>
        </div>
        <div className="hidden flex-col items-center justify-center rounded-lg bg-slate-100 px-5 py-3.5 pt-3 text-xs font-medium text-slate-500 sm:flex ">
          <div className="hidden font-bold uppercase text-slate-400 sm:block">HOVER TIPS</div>
          <div className="block font-bold uppercase text-slate-300 sm:hidden">CLICKABLE TIPS</div>
          <div className="mt-2 flex w-full flex-row items-center justify-start whitespace-nowrap">
            <CustomTooltip
              trigger={
                <div className="mr-1.5 flex h-5 w-10 cursor-pointer flex-row items-center justify-center rounded-full border-gBlue bg-gBlue py-2 text-center text-[11px] font-bold uppercase transition-all hover:bg-gBlue/70 hover:text-gBlue">
                  <span className="text-[11px]">❕</span>
                </div>
              }
            >
              <div>An example caveat or warning.</div>
            </CustomTooltip>{' '}
            Caveats and Warnings
          </div>
          <div className="mt-2 flex w-full flex-row items-center justify-start whitespace-nowrap">
            <CustomTooltip
              trigger={
                <div className="mr-1.5 flex h-5 w-10 cursor-pointer flex-row items-center justify-center rounded-full bg-gGreen py-2 text-center text-[11px] font-bold uppercase text-white transition-all hover:bg-gGreen/70">
                  <span className="text-[11px]">🧑‍🔬</span>
                </div>
              }
            >
              <div>Technical details here. 🤖</div>
            </CustomTooltip>{' '}
            Advanced Technical Details
          </div>
        </div>
      </div>

      <div className="mb-8 flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded px-3 py-1 sm:flex-row sm:px-7">
        <div className="mb-2 flex w-full flex-row items-center justify-between gap-x-2 sm:mb-0 sm:w-auto sm:flex-col sm:justify-start">
          <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-0 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
            🔧 Get Started
          </span>
          <div className="flex flex-row gap-x-1.5 sm:flex-auto sm:flex-col">
            <WarningTooltip>
              <div className="font-medium text-slate-600">
                {`Remember that interpretability is full of unsolved problems. It's an exciting, but very early field.`}
                <br />
                <br />
                One of the goals of this demo is to get more people (like you!) into the field to help solve these
                problems.
              </div>
            </WarningTooltip>
            <DeepDiveTooltip>
              <div className="font-medium text-slate-600">
                You found the first Deep Dive! 🥳
                <br />
                <br />
                This demo uses Google {`DeepMind's`}{' '}
                <a href={blogPostLink} target="_blank" rel="noreferrer" className="text-gBlue">
                  Gemma Scope Sparse Autoencoders
                </a>{' '}
                for Gemma 2 2B, layer 20, 16k width.
                <br />
                <br />
                Sparse autoencoders are a dictionary-learning based approach to disentangle the internal
                representations, which are otherwise entangled in a phenomenon known as superposition. (
                <a
                  href="https://transformer-circuits.pub/2022/toy_model/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gBlue"
                >
                  Elhage et al.
                </a>
                )
              </div>
            </DeepDiveTooltip>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 flex-row items-start justify-start gap-x-3 gap-y-3 text-left text-sm font-medium text-slate-500 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
          <button
            type="button"
            onClick={() => {
              tabUpdater('microscope');
              completedTabsAdd('main');
            }}
            className=" relative flex min-h-[200px] flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border border-gBlue bg-gBlue/5 px-5 text-gBlue shadow-md transition-all hover:scale-105 hover:border-2 hover:bg-white hover:shadow-xl xl:min-h-[230px]"
          >
            <div className="absolute top-2 mx-auto flex w-full justify-center">
              <div className="whitespace-nowrap rounded-full bg-gBlue px-3 py-1.5 text-[9px] font-bold uppercase leading-none text-white lg:text-[11px]">
                Start Here
              </div>
            </div>
            <div className="mb-2 text-6xl leading-none">🔬</div>
            <div className="text-md font-bold xl:text-lg">Microscope</div>
            <div className="mt-1.5 text-center text-xs leading-normal text-slate-600 xl:text-[13px]">
              {`Scan Gemma 2's`} brain to see what {`it's`} thinking.
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              tabUpdater('analyze');
              completedTabsAdd('main');
            }}
            className="flex min-h-[200px] flex-1 cursor-default flex-col items-center justify-center rounded-3xl border border-gYellow bg-gYellow/5 px-5 text-gYellow opacity-40 transition-all xl:min-h-[230px]"
          >
            <div className="mb-2 text-6xl">⚡️</div>
            <div className="text-md font-bold xl:text-lg">Analyze Features</div>
            <div className="mt-1.5 text-center text-xs leading-normal text-slate-600 xl:text-[13px]">
              Make features fire and figure out what they do.
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              tabUpdater('steer');
              completedTabsAdd('main');
            }}
            className="flex min-h-[200px] flex-1 cursor-default flex-col items-center justify-center rounded-3xl border border-gRed bg-gRed/5 px-5 text-gRed  opacity-40 transition-all xl:min-h-[230px]"
          >
            <div className="mb-2 text-6xl">🕹️</div>
            <div className="text-md font-bold xl:text-lg">Steer Gemma</div>
            <div className="mt-1.5 text-center text-xs leading-normal text-slate-600 xl:text-[13px]">
              Change {`Gemma's`} behavior by manipulating features.
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              tabUpdater('learn');
              completedTabsAdd('main');
            }}
            className="flex min-h-[200px] flex-1 cursor-default flex-col items-center justify-center rounded-3xl border border-gGreen bg-gGreen/5 px-5 text-gGreen opacity-40 transition-all xl:min-h-[230px]"
          >
            <div className="mb-2 text-6xl">🚀</div>
            <div className="text-md font-bold xl:text-lg">Do More</div>
            <div className="mt-1.5 text-center text-xs leading-normal text-slate-600 xl:text-[13px]">
              Dive deeper into the exciting world of AI interpretability.
            </div>
          </button>
        </div>
      </div>

      <div className="mb-8 flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded px-3 py-1 pb-8 sm:flex-row sm:px-7">
        <div className="mb-2 flex w-full flex-row items-center justify-between gap-x-2 sm:mb-0 sm:w-auto sm:flex-col sm:justify-start">
          <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-0 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
            Browse SAEs
          </span>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-x-3 gap-y-3 text-left text-sm font-medium text-slate-500">
          Already know what SAEs are?
          <button
            type="button"
            onClick={() => {
              tabUpdater('browse');
            }}
            className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border border-slate-600 bg-slate-600/5 px-5 py-5 text-slate-600 transition-all hover:bg-slate-600/20"
          >
            <div className="text-md font-bold xl:text-lg">Browse & Search SAEs</div>
            <div className="mt-1.5 text-center text-xs leading-normal text-slate-600 xl:text-[13px]">
              Directly explore the SAEs in Gemma Scope.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
