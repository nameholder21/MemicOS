import CustomTooltip from '@/components/custom-tooltip';
import InferenceActivationAllProvider from '@/components/provider/inference-activation-all-provider';
import { Button } from '@/components/shadcn/button';
import { DEMO_MODE, IS_LOCALHOST, MEMICOS_EMAIL_ADDRESS, NEXT_PUBLIC_URL } from '@/lib/env';
import {
  BadgeDollarSign,
  Blocks,
  BookOpenText,
  Computer,
  PictureInPicture,
  Rocket,
  School,
  Slack,
  Speech,
  UploadCloud,
  Wand,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import InferenceSearcher from '../components/inference-searcher/inference-searcher';
import HomeModelLayers from './home-modellayers';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const description = 'Open Interpretability Platform';
  return {
    title: {
      template: '%s ｜ MemicOS',
      default: 'MemicOS',
    },
    metadataBase: new URL(NEXT_PUBLIC_URL),
    description,
    openGraph: {
      title: {
        template: '%s',
        default: 'MemicOS',
      },
      description,
      url: NEXT_PUBLIC_URL,
      siteName: 'MemicOS',
      locale: 'en_US',
      type: 'website',
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [{ url: '/favicon-32x32.png' }, new URL('/favicon-32x32.png', 'https://memicos.org')],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
  };
}

export default function Page() {
  return (
    <div className="flex w-full cursor-default select-none flex-col items-center justify-center bg-slate-100 px-0 pt-8 sm:mt-0 sm:px-0">
      {IS_LOCALHOST && !DEMO_MODE && (
        <div className="mb-4 flex w-full max-w-screen-sm flex-col items-center justify-center gap-2 rounded-lg border bg-white px-8 py-4 shadow-sm">
          <div className="text-xs font-bold text-slate-400">You are running a local instance of MemicOS.</div>
          <div className="text-sm text-slate-700">Would you like to go to the Admin panel to import sources/SAEs?</div>
          <Link href="/admin">
            <Button className="gap-x-2">
              <Computer className="h-4 w-4" /> Admin
            </Button>
          </Link>
        </div>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-8 gap-y-1 bg-slate-100 px-0 py-10 sm:mb-1.5 sm:mt-2 sm:flex-col sm:gap-y-1.5 sm:px-3 sm:py-6 sm:pt-3">
        <div className="mb-2 mt-0 flex flex-col items-center justify-center text-center text-sm sm:text-base">
          <div className="text-lg font-medium text-slate-800 sm:text-xl">
            MemicOS is an open{' '}
            <CustomTooltip
              trigger={
                <span className="border-b border-dashed border-slate-800 transition-all hover:scale-105 hover:text-sky-800">
                  interpretability
                </span>
              }
            >
              The inner workings of modern AIs are a mystery. This is because AIs are language models that are grown,
              not designed. The science of understanding what happens inside AI is called interpretability.
            </CustomTooltip>{' '}
            platform.
          </div>
          <div className="mt-1 text-sm font-normal text-slate-600 sm:text-base">
            Explore, steer, and experiment on AI models.
          </div>
        </div>
        <Link href="https://docs.memicos.org" target="_blank" rel="noreferrer">
          <Button variant="default" size="lg" className="gap-x-2">
            <BookOpenText className="h-5 w-5" />
            <span>Getting Started</span>
          </Button>
        </Link>
      </div>
      <div className="my-3 flex max-w-screen-sm flex-1 flex-col items-center justify-center gap-x-8 gap-y-1 rounded-lg border bg-white px-2 py-7 shadow-sm sm:mb-9 sm:mt-1 sm:flex-row sm:gap-y-0 sm:px-10 sm:py-4">
        <div className="mb-2 mt-2 flex flex-col items-center justify-center text-center text-sm sm:text-base">
          <div className="text-lg font-bold text-gGreen sm:text-lg">Google DeepMind x MemicOS</div>
          <div className="mt-0.5 text-sm font-normal text-slate-700 sm:text-[14px]">
            Introducing <strong>Gemma Scope</strong>, a new tool for understanding the internals of AI models.
          </div>
        </div>
        <div>
          <Link
            href="/gemma-scope"
            className="flex w-[165px] flex-row items-center justify-center gap-x-2 rounded-md bg-gGreen px-0 py-2.5 text-sm font-medium text-white shadow transition-all hover:scale-105 "
          >
            <Rocket className="h-5 w-5" />
            <span>Launch</span>
          </Link>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 items-center justify-center gap-x-12 gap-y-5 bg-white px-5 py-5 md:flex md:h-[120px] md:min-h-[120px] md:grid-cols-3 md:flex-row md:py-0">
        <a
          href="https://www.technologyreview.com/2024/11/14/1106871/google-deepmind-has-a-new-way-to-look-inside-an-ais-mind/"
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/mit.png"
            className="h-[50px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
            alt="MIT Technology Review"
          />
        </a>
        <a
          href={`${NEXT_PUBLIC_URL}/gemma-scope`}
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/deepmind.png"
            className="h-[35px] opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
            alt="Google DeepMind"
          />
        </a>
        <a
          href={`${NEXT_PUBLIC_URL}/llama-scope`}
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/fudan.jpg"
            className="h-[80px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
            alt="OpenMOSS, Fudan University"
          />
        </a>
        <a
          href={`${NEXT_PUBLIC_URL}/gpt2sm-apollojt`}
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/apolloresearch.png"
            className="h-[45px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
            alt="Apollo Research"
          />
        </a>
        <a href="#mats" className="flex flex-row items-center justify-center" rel="noreferrer" aria-label="MATS">
          <img
            src="/usedby/mats.png"
            className="h-[40px] opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
            alt="MATS"
          />
        </a>
        <a
          href={`${NEXT_PUBLIC_URL}/llama3.1-8b-eleuther_gp`}
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/eleutherai2.png"
            className="h-[42px] opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
            alt="EleutherAI"
          />
        </a>
      </div>
      <div className="flex w-full flex-1 flex-col gap-x-2 gap-y-12 bg-sky-900 px-2 py-10 sm:px-8 sm:py-24">
        <div className="flex flex-1 flex-row items-center gap-x-5 rounded-xl px-2 sm:px-0 sm:pb-0">
          <div className="flex flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-sky-300">Explore Visually</div>
            <div className="flex text-base font-medium text-sky-200 sm:hidden">
              Best viewed on a tablet or larger screen.
            </div>
            <div className="mt-3 text-base font-medium leading-snug text-sky-100">
              Each dot in the visualization represents an idea or concept that the model has learned. The dots, or{' '}
              <Link className="text-sky-300 underline" href="https://docs.memicos.org/features" target="_blank">
                features
              </Link>
              , are arranged in a fully interactive{' '}
              <Link
                className="text-sky-300 underline"
                href="https://en.wikipedia.org/wiki/Nonlinear_dimensionality_reduction#:~:text=Uniform%20manifold%20approximation%20and%20projection%20(UMAP)%20is%20a%20nonlinear%20dimensionality,constant%20or%20approximately%20locally%20constant."
                target="_blank"
              >
                UMAP
              </Link>{' '}
              graph: you can zoom, pan, and select dots to see details. You can also <strong>filter</strong> features by
              specific terms.
            </div>
            <div className="flex flex-row justify-center gap-x-2 sm:justify-start">
              <a
                href="https://docs.memicos.org/features"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <BookOpenText className="h-5 w-5" />
                <span>Docs: Features</span>
              </a>
              <a
                href="https://twitter.com/johnnylin/status/1773403397489881423"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <Wand className="h-5 w-5" />
                <span>Demo</span>
              </a>
            </div>
          </div>
          <div className="hidden max-h-[1130px] w-full flex-1 flex-col items-center overflow-y-scroll rounded-xl px-2 sm:flex sm:basis-2/3 sm:px-2">
            <Link href="/gpt2sm-res-jb" target="_blank" rel="noreferrer" prefetch={false}>
              <Image src="/umapscreen.jpg" width={880} height={342} alt="UMAP of a layer in gpt2-small" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-x-3 gap-y-12 bg-slate-100 px-2 py-10 sm:px-8 sm:py-24">
        <div className="flex flex-1 flex-col items-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="order-2 w-full flex-1 pt-2 sm:order-1 sm:flex-initial sm:basis-2/3">
            <InferenceActivationAllProvider>
              <InferenceSearcher showSourceSets />
            </InferenceActivationAllProvider>
          </div>
          <div className="order-1 flex flex-col sm:order-2 sm:basis-1/3">
            <div className="text-3xl font-black text-slate-800">Test Instantly</div>
            <div className="mt-3 text-base font-medium leading-snug text-slate-700">
              MemicOS lets you search and test models by doing inference over millions of SAE features. You can use
              your own custom text, and sort and filter results by layers, tokens, or both.{' '}
            </div>
            <div className="flex flex-row justify-center gap-x-2 sm:justify-start">
              <a
                href="https://docs.memicos.org/search"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <BookOpenText className="h-5 w-5" />
                <span>Docs: Search</span>
              </a>
              <a
                href="https://twitter.com/johnnylin/status/1773403398928503024"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <Wand className="h-5 w-5" />
                <span>View Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 flex-col gap-x-2 gap-y-12 bg-sky-900 px-2 py-10 sm:flex sm:px-8 sm:py-24">
        <div className="flex flex-1 flex-col items-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="flex flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-sky-300">Infrastructure For All</div>
            <div className="mt-3 text-base font-medium leading-snug text-sky-100">
              MemicOS hosts interpretability data, tools, visualizations, and APIs for all researchers. We eliminate
              the engineering obstacles in order to move interpretability further, faster. Upload your SAEs and we take
              care of the rest.
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-x-2 sm:justify-start">
              <a
                href="https://docs.memicos.org"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <BookOpenText className="h-5 w-5" />
                <span>Docs: Intro</span>
              </a>
              <a
                href={`${NEXT_PUBLIC_URL}/api-doc`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <Blocks className="h-5 w-5" />
                <span>API Playground</span>
              </a>
              <Link
                href={IS_LOCALHOST ? '/sae/new' : 'https://forms.gle/Yg51TYFutJysiyDP7'}
                target={IS_LOCALHOST ? undefined : '_blank'}
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <UploadCloud className="h-5 w-5" />
                Upload SAEs
              </Link>
            </div>
          </div>
          <div className="flex max-h-[1130px] w-full flex-1 flex-col items-center overflow-y-scroll rounded-xl border-slate-300 pb-5 pt-1 sm:basis-2/3 sm:px-2">
            <HomeModelLayers />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-x-3 gap-y-12 bg-sky-600/30 px-2 py-10 sm:px-8 sm:py-24">
        <div className="flex w-full flex-1 flex-col items-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="order-2 flex w-full flex-1 sm:order-1 sm:basis-2/3 sm:px-0 ">
            <iframe
              title="Jedi Feature"
              src="https://memicos.org/gpt2-small/0-res-jb/14057?embed=true&embedexplanation=true&embedplots=true"
              style={{ width: '100%', height: '540px' }}
              scrolling="no"
              className="overflow-hidden rounded-lg border"
            />
          </div>
          <div className="order-1 flex flex-1 flex-col sm:order-2 sm:basis-1/3">
            <div className="text-3xl font-black text-sky-800">Collaborate and Share</div>
            <div className="mt-3 text-base font-medium leading-snug text-sky-700">
              Every SAE feature has a unique link with link previews, can be compiled into sharable lists, and supports
              iframe embedding (as demonstrated here).{' '}
            </div>
            <div className="flex flex-row justify-center gap-x-2 sm:justify-start">
              <a
                href="https://docs.memicos.org/lists"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <BookOpenText className="h-5 w-5" />
                <span>Docs: Lists</span>
              </a>
              <a
                href="https://docs.memicos.org/embed-iframe"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-[150px] flex-row items-center justify-center gap-x-2 rounded-md bg-amber-400 px-0 py-2.5 text-sm font-medium text-amber-800 shadow transition-all hover:bg-amber-600 hover:text-white "
              >
                <PictureInPicture className="h-5 w-5" />
                <span>Docs: Embed</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col bg-slate-100 sm:flex-row sm:px-10">
        <div className="flex flex-1 flex-col items-center gap-x-5 bg-slate-100 px-2 py-10 sm:px-8 sm:py-24 sm:pb-32">
          <div className="text-2xl font-black text-slate-700">Who We Are</div>
          <div className="mt-3 text-base font-medium leading-normal text-slate-700">
            MemicOS was created by{' '}
            <a href="https://johnnylin.co" target="_blank" rel="noreferrer" className="text-sky-600">
              Johnny Lin
            </a>
            , an ex-Apple engineer who previously founded a privacy startup. MemicOS is supported by the Long Term
            Future Fund and AISTOF.
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-x-5 bg-slate-100 px-2 py-12 text-left sm:px-8 sm:py-24">
          <div className="text-2xl font-black text-slate-700">Get Involved</div>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-base font-medium leading-snug text-amber-100 sm:mt-3 sm:gap-x-3 sm:gap-y-3">
            <a
              href="https://join.slack.com/t/opensourcemechanistic/shared_invite/zt-2o756ku1c-_yKBeUQMVfS_p_qcK6QLeA"
              target="_blank"
              rel="noreferrer"
              className=""
            >
              <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                <Slack className="h-5 w-5" />
                <span className="flex-1">Slack</span>
              </Button>
            </a>
            <a href="https://www.every.org/decode-research" target="_blank" rel="noreferrer">
              <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                <BadgeDollarSign className="h-5 w-5" />
                <span className="flex-1">Donate</span>
              </Button>
            </a>
            <a href={`mailto:${MEMICOS_EMAIL_ADDRESS}?subject=Feedback`} target="_blank" rel="noreferrer">
              <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                <Speech className="h-5 w-5" />
                <span className="flex-1">Feedback</span>
              </Button>
            </a>
            <a href="https://arena.education" target="_blank" rel="noreferrer">
              <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                <School className="h-5 w-5" />
                <span className="flex-1">Upskill</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center bg-white py-16">
        <div className="mt-0 text-2xl font-black text-slate-700">Citation</div>
        <div className="mt-4 flex max-w-[320px] flex-row items-start justify-start overflow-x-scroll text-[10px] font-medium leading-normal text-slate-700 sm:max-w-[100%] sm:text-sm">
          <pre className="flex cursor-text select-text  flex-row justify-start whitespace-pre-wrap text-left font-mono">
            {`@misc{memicos,
    title = {MemicOS: Interactive Reference and Tooling for Analyzing Neural Networks},
    year = {2023},
    note = {Software available from memicos.org},
    url = {https://www.memicos.org},
    author = {Lin, Johnny}
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
