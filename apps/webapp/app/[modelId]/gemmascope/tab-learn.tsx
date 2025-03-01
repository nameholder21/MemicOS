import { useGlobalContext } from '@/components/provider/global-provider';
import { MEMICOS_EMAIL_ADDRESS } from '@/lib/env';
import { Gamepad2, HelpCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { blogPostLink, codingTutorialLink, hfLink, techReportLink } from './tab-main';

export default function TabLearn({ tabUpdater }: { tabUpdater: (tab: string) => void }) {
  const session = useSession();
  const { setSignInModalOpen } = useGlobalContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative mt-0 flex h-full w-full max-w-screen-xl flex-col items-center justify-start bg-white pb-24 pt-1">
      <div ref={ref} className="pt-20 sm:pt-0" />

      <div className="mb-5 mt-5 flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded px-3 py-1 sm:flex-row sm:px-7">
        <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
          ⭐️ Up Next
        </span>

        <div className=" flex w-full flex-col items-start justify-start text-left text-sm font-medium text-slate-500">
          <div>
            {!session.data?.user && (
              <div className="mb-2.5 flex flex-col items-start gap-y-1.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setSignInModalOpen(true);
                  }}
                  className="mr-2.5 w-[140px] whitespace-nowrap rounded-full bg-gGreen px-4 py-2 text-center text-white hover:bg-gGreen/80"
                >
                  Get Notified
                </button>{' '}
                Enjoyed this demo? Sign up to get notified by email when MemicOS drops a new demo. No spam, ever.
              </div>
            )}
            <div className="mb-2.5 flex flex-col items-start gap-y-1.5 sm:flex-row sm:items-center">
              <a
                href="https://www.memicos.org/steer"
                rel="noreferrer"
                target="_blank"
                className="mr-2.5 w-[140px] whitespace-nowrap rounded-full bg-gYellow px-4 py-2 text-center text-white hover:bg-gYellow/80"
              >
                Advanced Steer
              </a>
              Steer with any feature in Gemma 2. Fully customizable.
            </div>
            <div className="mb-2.5 flex flex-col items-start gap-y-1.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  tabUpdater('browse');
                }}
                className="mr-2.5 w-[140px] whitespace-nowrap rounded-full bg-gRed px-4 py-2 text-center text-white hover:bg-gRed/80"
              >
                Browse SAEs
              </button>
              Browse and search all SAEs in the Gemma Scope release, including Gemma 2 2B and 9B.
            </div>
            <div className="flex flex-col items-start gap-y-1.5 sm:flex-row sm:items-center">
              <a
                href={`mailto:${MEMICOS_EMAIL_ADDRESS}?subject=Gemma%20Scope%20Demo%20Feedback%20or%20Question`}
                target="_blank"
                rel="noreferrer"
                className="mr-2.5 w-[140px] whitespace-nowrap rounded-full bg-gBlue px-4 py-2 text-center text-white hover:bg-gBlue/80"
              >
                Contact Us
              </a>{' '}
              Questions, feedback, or did you find a hilarious feature or steer? Hit us up.
            </div>
          </div>
          <div className="mt-2.5 leading-normal">
            This demo of Gemma Scope is on MemicOS, a platform for interpretability that lets researchers visualize,
            search, test, and steer AI models. To keep things simple, the tools in this demo are scaled-down versions of
            the ones on{' '}
            <a href="https://memicos.org" target="_blank" rel="noreferrer" className="font-bold text-gGreen">
              memicos.org
            </a>
            .
          </div>

          <div className="mt-2.5 leading-normal">
            To do more and get involved with interpretability, check out the resources below.
          </div>
        </div>
      </div>

      <div className="mb-7 flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded px-3 py-1 sm:flex-row sm:px-7">
        <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
          🌮 Official
        </span>

        <div className="flex w-full flex-col items-start justify-start gap-x-3 gap-y-4 text-left text-sm font-medium text-slate-500">
          <div className="flex w-full flex-col items-start justify-start gap-x-3 gap-y-1.5 sm:flex-row sm:items-center sm:justify-center">
            <a
              href={blogPostLink}
              rel="noreferrer"
              target="_blank"
              className="flex-1 whitespace-nowrap rounded-full bg-slate-200 px-4 py-2 text-center hover:bg-slate-100"
            >
              DeepMind Blog Post ↗
            </a>
            <a
              href={codingTutorialLink}
              rel="noreferrer"
              target="_blank"
              className="flex-1 whitespace-nowrap rounded-full bg-slate-200 px-4 py-2 text-center hover:bg-slate-100"
            >
              Coding Tutorial ↗
            </a>
            <a
              href={techReportLink}
              rel="noreferrer"
              target="_blank"
              className="flex-1 whitespace-nowrap rounded-full bg-slate-200 px-4 py-2 text-center hover:bg-slate-100"
            >
              Technical Report ↗
            </a>
            <a
              href={hfLink}
              rel="noreferrer"
              target="_blank"
              className="flex-1 whitespace-nowrap rounded-full bg-slate-200 px-4 py-2 text-center hover:bg-slate-100"
            >
              HuggingFace ↗
            </a>
          </div>
        </div>
      </div>

      <div className="mb-7 flex w-full flex-row items-center justify-start px-2 sm:px-5">
        <div className="flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded  px-2 py-1 sm:flex-row">
          <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
            🔗 Resources
          </span>
          <div className="flex w-full flex-col items-start justify-start gap-y-2 text-sm font-medium text-slate-500">
            <div className="mt-0 font-bold text-slate-600">Self Directed Learning</div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://www.neelnanda.io/mechanistic-interpretability/getting-started"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                Get Started with Mech Interp
              </a>
              A guide by Neel Nanda, head of mechanistic interpretability at Google DeepMind.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://www.alignmentforum.org/posts/NfFST5Mio7BCAQHPA/an-extremely-opinionated-annotated-list-of-my-favourite-1"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                Favourite Mech Interp Papers
              </a>
              A curated selection by Neel Nanda.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://transformer-circuits.pub/2023/monosemantic-features"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                Toward Monosemanticity
              </a>
              A seminal work in interpretability for achieving monosemanticity - extracting features that have one
              concept, instead of multiple.
            </div>

            <div className="mt-2 font-bold text-slate-600">Tooling and Code</div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://github.com/jbloomAus/SAELens"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                SAELens
              </a>
              Train Sparse Autoencoders, like Gemma Scope.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://github.com/TransformerLensOrg/TransformerLens"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                TransformerLens
              </a>
              A popular library for interpretability.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://github.com/ndif-team/nnsight"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                NNsight
              </a>
              Interpret and manipulate the internals of models.
            </div>

            <div className="mt-2 font-bold text-slate-600">Serious Learning</div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://www.matsprogram.org"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                MATS Program
              </a>
              A top program for gaining experience as a mechanistic intepretability researcher.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://arena.education"
                rel="noreferrer"
                target="_blank"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                ARENA Education
              </a>
              Alignment Research Engineer Accelerator for upskilling.
            </div>

            <div className="mt-2 font-bold text-slate-600">Social & Updates</div>
            {!session.data?.user && (
              <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSignInModalOpen(true);
                  }}
                  className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
                >
                  Email Signup
                </button>
                Get notified of new releases and drops. No spam, ever.
              </div>
            )}
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href="https://twitter.com/memicos"
                target="_blank"
                rel="noreferrer"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                Twitter
              </a>{' '}
              We tweet our bigger updates.
            </div>
            <div className="flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-center">
              <a
                href={`mailto:${MEMICOS_EMAIL_ADDRESS}?subject=Gemma+Scope+Feedback`}
                target="_blank"
                rel="noreferrer"
                className="mr-2 whitespace-nowrap rounded-full bg-slate-200 px-4 py-1 hover:bg-slate-100"
              >
                Contact Us
              </a>
              Send us your suggestions, feedback, and questions.
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 flex w-full flex-row items-center justify-start px-2 pb-24 sm:px-5">
        <div className="flex w-full flex-col items-start justify-start gap-x-4 gap-y-1.5 rounded  px-2 py-1 sm:flex-row">
          <span className="w-[105px] min-w-[105px] max-w-[105px] whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-center text-[10px] font-bold uppercase text-slate-600">
            🎁 Next
          </span>
          <div className="flex w-full flex-col items-start justify-start gap-y-4 text-sm font-medium text-slate-500">
            <button
              type="button"
              onClick={() => {
                tabUpdater('openproblems');
              }}
              className="mt-0 flex min-w-[160px] cursor-pointer flex-row justify-center gap-x-2 rounded-full border border-slate-600 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow transition-all hover:scale-105 hover:bg-slate-300"
            >
              <HelpCircle className="h-5 w-5 text-slate-600" /> Open Problems
            </button>
            <button
              type="button"
              onClick={() => {
                tabUpdater('playground');
              }}
              className="mt-0 flex min-w-[160px] cursor-pointer flex-row justify-center gap-x-2 rounded-full border border-indigo-600 bg-white px-5 py-2 text-sm font-medium text-indigo-600 shadow transition-all hover:scale-105 hover:bg-indigo-300"
            >
              <Gamepad2 className="h-5 w-5 text-indigo-600" /> Playground
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
