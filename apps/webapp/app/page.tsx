import CustomTooltip from '@/components/custom-tooltip';
import JumpToSAE from '@/components/jump-to-sae';
import InferenceActivationAllProvider from '@/components/provider/inference-activation-all-provider';
import RandomFeatureLink from '@/components/random-feature-link';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import {
  DEFAULT_MODELID,
  DEFAULT_SOURCE,
  DEMO_MODE,
  IS_LOCALHOST,
  NEXT_PUBLIC_URL,
  SITE_NAME_VERCEL_DEPLOY,
} from '@/lib/env';
import { getSourceSetNameFromSource } from '@/lib/utils/source';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  BadgeDollarSign,
  Blocks,
  BookOpenText,
  Computer,
  Github,
  Microscope,
  PictureInPicture,
  RocketIcon,
  School,
  Search,
  Slack,
  Speech,
  Wand,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FeatureSelector from '../components/feature-selector/feature-selector';
import InferenceSearcher from '../components/inference-searcher/inference-searcher';
import HomeModels from './home/home-models';
import HomeReleases from './home/home-releases';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const description = 'Open Source Interpretability Platform';
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

      <div className="relative my-3 mb-0 flex max-w-screen-sm flex-1 flex-col items-center justify-center gap-x-8 gap-y-1 overflow-hidden rounded-lg border bg-white px-2 py-10 shadow-sm sm:mb-8 sm:mt-4 sm:gap-y-0 sm:px-16 sm:py-5">
        <div className="mb-2 mt-0 flex flex-col items-center justify-center text-center text-sm sm:text-base">
          <div className="px-20 py-1 text-xs font-bold text-sky-600 sm:absolute sm:-left-20 sm:top-4 sm:rotate-[-36deg] sm:bg-yellow-400 sm:text-[9px] sm:text-slate-700">
            New: May 2025
          </div>
          <div className="mt-1 text-base font-bold text-slate-800 sm:text-base">
            MemicOS x Anthropic: Circuit Tracer
          </div>
          <div className="mt-1 text-sm font-normal text-slate-700 sm:text-[13px]">
            Generate and share attribution graphs, based on Anthropic&apos;s{' '}
            <a
              href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html"
              className="text-sky-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Circuit Tracing paper
            </a>
            .
          </div>
        </div>
        <div className="mb-2 mt-2 flex flex-col items-center justify-center gap-x-2.5 gap-y-2 sm:flex-row">
          <Link href="https://github.com/safety-research/circuit-tracer" target="_blank" rel="noreferrer">
            <Button
              variant="default"
              size="lg"
              className="w-[165px] max-w-[165px] gap-x-2 bg-slate-800 text-white transition-all hover:scale-105 hover:bg-slate-900"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </Button>
          </Link>
          <Link href="https://www.anthropic.com/research/open-source-circuit-tracing" target="_blank" rel="noreferrer">
            <Button
              variant="default"
              size="lg"
              className="w-[165px] max-w-[165px] gap-x-2 bg-[#cc785c] text-[#191919] transition-all hover:scale-105 hover:bg-[#d4a27f]"
            >
              <svg
                fill="#000000"
                fill-rule="evenodd"
                height="1.2em"
                style={{ flex: 'none', lineHeight: '1' }}
                viewBox="0 0 24 24"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Anthropic</title>
                <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
              </svg>{' '}
              <span>Blog Post</span>
            </Button>
          </Link>
          <Link
            href="/gemma-2-2b/graph"
            className="flex w-[165px] max-w-[165px] flex-row items-center justify-center gap-x-2 rounded-md bg-emerald-600 px-0 py-2.5 text-sm font-medium text-white shadow transition-all hover:scale-105 hover:bg-sky-700"
          >
            <RocketIcon className="h-5 w-5" />
            <span>Launch</span>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-8 gap-y-1 bg-slate-100 px-0 py-8 sm:mb-10 sm:mt-0 sm:flex-col sm:gap-y-1.5 sm:px-3 sm:py-6 sm:pt-2">
        <div className="mb-2 mt-0 flex flex-col items-center justify-center text-center text-sm sm:text-base">
          <div className="text-lg font-medium text-slate-800 sm:text-xl">
            {SITE_NAME_VERCEL_DEPLOY ? (
              <div className="pb-1 text-4xl font-semibold text-[#7B3F00]">{SITE_NAME_VERCEL_DEPLOY}</div>
            ) : (
              <>
                MemicOS is an{' '}
                <a
                  href="https://github.com/hijohnnylin/memicos#readme"
                  className="transition-all hover:text-slate-900/70 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  open source
                </a>{' '}
                <CustomTooltip
                  trigger={
                    <span className="font-bold text-sky-700 transition-all hover:cursor-pointer hover:text-sky-600">
                      interpretability
                    </span>
                  }
                >
                  The inner workings of modern AIs are a mystery. This is because AIs are language models that are
                  grown, not designed. The science of understanding what happens inside AI is called interpretability.
                </CustomTooltip>{' '}
                platform.
              </>
            )}
          </div>
          <div className="mt-1 text-sm font-normal text-slate-600 sm:text-base">
            {SITE_NAME_VERCEL_DEPLOY ? (
              <div className="leading-relaxed">
                Welcome to your very own MemicOS instance.
                <br />
                Check out the{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/hijohnnylin/memicos#readme"
                  className="font-semibold text-sky-700 underline"
                >
                  README
                </a>{' '}
                to start building and customizing MemicOS.
              </div>
            ) : (
              'Explore, steer, and experiment on AI models.'
            )}
          </div>
        </div>
        <div className="flex flex-col gap-x-2.5 gap-y-2 sm:flex-row">
          <Link href="https://docs.memicos.org" target="_blank" rel="noreferrer">
            <Button variant="default" size="lg" className="w-[220px] gap-x-2 bg-sky-600 text-white hover:bg-sky-700">
              <BookOpenText className="h-5 w-5" />
              <span>Getting Started</span>
            </Button>
          </Link>
          <Link
            href="/gemma-scope"
            className="flex w-[220px] flex-row items-center justify-center gap-x-2 rounded-md bg-emerald-600 px-0 py-2.5 text-sm font-medium text-white shadow transition-all hover:scale-105"
          >
            <Microscope className="h-5 w-5" />
            <span>Tutorial: Gemma Scope</span>
          </Link>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 items-center justify-center gap-x-12 gap-y-5 bg-white px-5 py-5 md:flex md:h-[95px] md:min-h-[95px] md:grid-cols-3 md:flex-row md:py-0">
        <a
          href="https://www.technologyreview.com/2024/11/14/1106871/google-deepmind-has-a-new-way-to-look-inside-an-ais-mind/"
          target="_blank"
          className="flex flex-row items-center justify-center"
          rel="noreferrer"
        >
          <img
            src="/usedby/mit.png"
            className="h-[40px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
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
            className="h-[30px] opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
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
            className="h-[70px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
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
            className="h-[35px] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
            alt="Apollo Research"
          />
        </a>
        <a href="#mats" className="flex flex-row items-center justify-center" rel="noreferrer" aria-label="MATS">
          <img
            src="/usedby/mats.png"
            className="h-[35px] opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
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
            className="h-[35px] opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
            alt="EleutherAI"
          />
        </a>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center bg-sky-100 py-12 sm:py-16 sm:pt-14">
        <div className="flex max-w-screen-xl flex-1 flex-col items-center gap-x-5 rounded-xl px-2 sm:px-0">
          <div className="flex flex-col text-center">
            <div className="text-3xl font-black text-sky-800">Explore</div>
            <div className="mt-3 text-[15px] font-medium leading-relaxed text-sky-800">
              Browse over four terabytes of activations, explanations, and metadata. <br className="hidden sm:block" />
              MemicOS supports probes,{' '}
              <a href="https://docs.memicos.org/features" className="text-sky-600 underline" target="_blank">
                latents/features
              </a>
              , custom vectors,{' '}
              <a href="/axbench" className="text-sky-600 underline" target="_blank">
                concepts
              </a>
              , and more.
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col gap-x-3 gap-y-3 pt-6 sm:flex-row">
            <Card className="flex flex-1 flex-col gap-x-3 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-row gap-x-2 text-slate-800">
                  <div>Releases</div>
                  <CustomTooltip wide trigger={<QuestionMarkCircledIcon className="h-4 w-4" />}>
                    <div className="flex flex-col">
                      A {`"release"`} is the data (activations, explanations, vectors, etc) associated with a specific
                      paper or post. Each release can contain data for multiple models, layers, and {`"sources"/SAEs`}.
                      Releases are the broadest grouping of data on MemicOS.
                    </div>
                  </CustomTooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-row gap-x-3">
                <HomeReleases />
              </CardContent>
            </Card>
            <Card className="flex flex-1 flex-col gap-x-3 bg-white sm:max-w-[360px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-row gap-x-2 text-slate-800">
                  <div>Models</div>
                  <CustomTooltip wide trigger={<QuestionMarkCircledIcon className="h-4 w-4" />}>
                    <div className="flex flex-col">
                      Choose a model to view its releases and all associated data with it, including sources,
                      activations, explanations, and more.{' '}
                      {`You'll also be able to directly experiment with the model with tools such as steering or activation testing.`}
                    </div>
                  </CustomTooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-row gap-x-3">
                <HomeModels />
              </CardContent>
            </Card>

            <Card className="flex flex-1 flex-col gap-x-3 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-row gap-x-2 text-slate-800">
                  <div>Jump To</div>
                  <CustomTooltip wide trigger={<QuestionMarkCircledIcon className="h-4 w-4" />}>
                    <div className="flex flex-col">
                      A source is a group of latents/features/vectors/concepts associated with a specific model. For
                      example, the gemma-2-2b@20-gemmascope-res-16k source contains 16,384 latents from Gemma Scope
                      associated with the 20th layer for the residual stream hook. Sources are not always SAE
                      features/latents - for example, the AxBench sources are {`"concepts"`}.
                    </div>
                  </CustomTooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-start justify-start gap-x-3 pl-10">
                <JumpToSAE modelId={DEFAULT_MODELID || ''} layer={DEFAULT_SOURCE || ''} modelOnSeparateRow />
                <div className="mt-4 flex w-full cursor-pointer flex-col items-start justify-start border-t border-b-slate-100 pt-4 text-sm font-medium text-sky-700 outline-none">
                  <div className="text-[10px] font-medium uppercase text-slate-500">Jump to Feature</div>
                  <FeatureSelector
                    showModel
                    openInNewTab={false}
                    defaultModelId={DEFAULT_MODELID || ''}
                    defaultSourceSet={getSourceSetNameFromSource(DEFAULT_SOURCE || '')}
                    defaultIndex="0"
                    filterToPublic
                    modelOnSeparateRow
                    autoFocus={false}
                  />
                </div>
                {DEFAULT_MODELID && DEFAULT_SOURCE && (
                  <div className="mt-4 flex w-full flex-col border-t pt-4">
                    <div className="mb-1 font-sans text-[9px] font-medium uppercase text-slate-500">Jump to Random</div>
                    <RandomFeatureLink modelId={DEFAULT_MODELID || ''} source={DEFAULT_SOURCE || ''} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-3 gap-y-12 bg-slate-50 px-2 py-12 sm:px-8 sm:py-16">
        <div className="flex max-w-screen-xl flex-1 flex-col items-center justify-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="flex flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-slate-800">Steer</div>
            <div className="mt-3 text-[15px] font-medium text-slate-700">
              Modify model behavior by steering its activations using latents or custom vectors. Steering supports
              instruct (chat) and reasoning models, and has fully customizable temperature, strength, seed, etc.
            </div>
            <div className="mt-3 flex flex-row justify-center gap-x-2 sm:justify-start">
              <Link
                href="https://www.memicos.org/gemma-2-9b-it/steer?saved=cm7cp63af00jx1q952neqg6e5"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="default" size="lg" className="gap-x-2">
                  <Wand className="h-5 w-5" />
                  <span>Try It: Gemma 2 - Cat Steering</span>
                </Button>
              </Link>
            </div>
          </div>
          <a
            href="https://www.memicos.org/gemma-2-9b-it/steer?saved=cm7cp63af00jx1q952neqg6e5"
            target="_blank"
            rel="noreferrer"
            className="w-full flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 pt-2 shadow transition-all duration-300 hover:ring-4 hover:ring-blue-400 hover:ring-opacity-50 sm:flex-initial sm:basis-2/3"
          >
            <Image
              src="/steering-example.png"
              alt="Steering example with a cat feature"
              className="rounded-md"
              width={1736}
              height={998}
            />
          </a>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-3 gap-y-12 bg-sky-100 px-2 py-12 sm:px-8 sm:py-16">
        <div className="flex max-w-screen-xl flex-1 flex-col items-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="flex flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-sky-800">Search</div>
            <div className="mt-3 text-[15px] font-medium text-sky-800">
              Search over 50,000,000 latents/vectors, either by semantic similarity to explanation text, or by running
              custom text via inference through a model to find top matches.{' '}
            </div>
            <div className="mt-3 flex flex-col justify-center gap-x-2 gap-y-1.5 sm:justify-start">
              <Link href="/search-explanations" target="_blank" rel="noreferrer">
                <Button variant="default" size="lg" className="gap-x-2">
                  <Search className="h-5 w-5" />
                  <span>Try It: Search by Explanation</span>
                </Button>
              </Link>
              <Link href="https://docs.memicos.org/search" target="_blank" rel="noreferrer">
                <Button variant="default" size="lg" className="gap-x-2">
                  <BookOpenText className="h-5 w-5" />
                  <span>Docs: Search via Inference</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full flex-1 sm:flex-initial sm:basis-2/3">
            <Card className="flex flex-1 flex-col gap-x-3 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-row gap-x-2 text-slate-800">
                  <div>Search via Inference</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <InferenceActivationAllProvider>
                  <InferenceSearcher showSourceSets />
                </InferenceActivationAllProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-3 gap-y-12 bg-slate-50 px-2 py-12 sm:px-8 sm:py-16">
        <div className="flex max-w-screen-xl flex-1 flex-col items-center justify-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="flex flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-slate-800">API + Libraries</div>
            <div className="mt-3 text-[15px] font-medium text-slate-700">
              MemicOS hosts the {`world's first interpretability API (March 2024)`} - and all functionality is
              available by API or Python/TypeScript libraries. Most endpoints have an OpenAPI spec and interactive docs.
            </div>
            <div className="mt-3 flex flex-row justify-center gap-x-2 sm:justify-start">
              <Link href="/api-doc" target="_blank" rel="noreferrer">
                <Button variant="default" size="lg" className="gap-x-2">
                  <Blocks className="h-5 w-5" />
                  <span>API Playground</span>
                </Button>
              </Link>
            </div>
          </div>
          <a
            href="/api-doc"
            target="_blank"
            rel="noreferrer"
            className="w-full flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 pt-2 shadow transition-all duration-300 hover:ring-4 hover:ring-blue-400 hover:ring-opacity-50 sm:flex-initial sm:basis-2/3"
          >
            <Image
              src="/search-screenshot.png"
              alt="Steering example with a cat feature"
              className="rounded-md"
              width={1726}
              height={1000}
            />
          </a>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-x-3 gap-y-12 bg-sky-100 px-2 py-12 sm:px-8 sm:py-16">
        <div className="flex w-full max-w-screen-xl flex-1 flex-col items-center gap-x-8 gap-y-8 rounded-xl px-2 sm:flex-row sm:px-0 sm:pb-0">
          <div className="flex flex-1 flex-col sm:basis-1/3">
            <div className="text-3xl font-black text-sky-800">Inspect</div>
            <div className="mt-3 text-[15px] font-medium text-sky-800">
              Go in depth on each probe/latent/feature with top activations, top logits, activation density, and live
              inference testing. All dashboards have unique links, can be compiled into sharable lists, and supports
              IFrame embedding, as demonstrated here.{' '}
            </div>
            <div className="mt-2 flex flex-row justify-center gap-x-2 sm:justify-start">
              <Link href="https://docs.memicos.org/lists" target="_blank" rel="noreferrer">
                <Button variant="default" size="lg" className="gap-x-2">
                  <BookOpenText className="h-5 w-5" />
                  <span>Docs: Lists</span>
                </Button>
              </Link>
              <Link href="https://docs.memicos.org/embed-iframe" target="_blank" rel="noreferrer">
                <Button variant="default" size="lg" className="gap-x-2">
                  <PictureInPicture className="h-5 w-5" />
                  <span>Docs: Embed</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-1 sm:basis-2/3 sm:px-0">
            <iframe
              title="Jedi Feature"
              src="https://memicos.org/gpt2-small/0-res-jb/14057?embed=true&embedexplanation=true&embedplots=true"
              style={{ width: '100%', height: '540px' }}
              scrolling="no"
              className="overflow-hidden rounded-lg border"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center bg-slate-100 sm:flex-row sm:px-10">
        <div className="flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-5 px-2 py-12 sm:flex-row sm:px-8 sm:py-16">
          <div className="flex flex-1 flex-col items-center justify-center gap-x-5 bg-slate-100">
            <div className="text-2xl font-black text-slate-700">Who We Are</div>
            <div className="mt-3 text-base font-medium leading-normal text-slate-700">
              MemicOS was created by{' '}
              <a href="https://johnnylin.co" target="_blank" rel="noreferrer" className="text-sky-600">
                Johnny Lin
              </a>
              , an ex-Apple engineer who previously founded a privacy startup. MemicOS is supported by Decode
              Research, the Long Term Future Fund, and AISTOF.
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-x-5 bg-slate-100 text-left">
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
              <a href="/contact" target="_blank" rel="noreferrer">
                <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                  <Speech className="h-5 w-5" />
                  <span className="flex-1">Contact</span>
                </Button>
              </a>
              <a href="https://arena.education" target="_blank" rel="noreferrer">
                <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                  <School className="h-5 w-5" />
                  <span className="flex-1">Upskill</span>
                </Button>
              </a>
              <a href="https://www.every.org/decode-research" target="_blank" rel="noreferrer">
                <Button className="h-14 w-[170px] gap-x-2 sm:w-[200px]" size="lg">
                  <BadgeDollarSign className="h-5 w-5" />
                  <span className="flex-1">Donate</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center bg-white py-16">
        <div className="mt-0 text-2xl font-black text-slate-700">Citation</div>
        <div className="mt-4 flex max-w-[320px] flex-row items-start justify-start overflow-x-scroll text-[10px] font-medium leading-normal text-slate-700 sm:max-w-[100%] sm:text-sm">
          <pre className="flex cursor-text select-text flex-row justify-start whitespace-pre-wrap text-left font-mono">
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
