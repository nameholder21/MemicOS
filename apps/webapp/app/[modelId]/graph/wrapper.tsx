'use client';

import { useGraphContext } from '@/components/provider/graph-provider';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import { LoadingSquare } from '@/components/svg/loading-square';
import copy from 'copy-to-clipboard';
import { ChevronLeft, ChevronRight, CodeIcon, CopyIcon, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import GraphFeatureDetail from './feature-detail';
import GraphToolbar from './graph-toolbar';
import LinkGraph from './link-graph';
import GraphNodeConnections from './node-connections';
import Subgraph from './subgraph';

const ALWAYS_SHOW_WELCOME_MODAL = false;

function WelcomeModal({ hasSlug }: { hasSlug: boolean }) {
  const { isWelcomeModalOpen, setIsWelcomeModalOpen, setIsGenerateGraphModalOpen } = useGraphContext();
  const [currentStep, setCurrentStep] = useState(0);
  const searchParams = useSearchParams();

  console.log('hasSlug', hasSlug);
  const steps = [
    {
      number: 0,
      title: 'Getting Started - New, Solved, and Unsolved Graphs',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          This guide explains how to use and interpret the many interactive parts of Circuit Tracer. But if you want to
          just jump in and read the guide later, you can generate a graph with a custom prompt.
          <Button
            onClick={() => {
              setIsWelcomeModalOpen(false);
              setIsGenerateGraphModalOpen(true);
            }}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Generate New Graph
          </Button>
          <p className="mt-2">
            Want to see some examples first? Here are graphs that we&apos;ve &quot;solved&quot;, meaning it has a
            subgraph that has a decent theory of how the model came to its result, and also some graphs that are still
            unsolved. Share if you&apos;ve think you&apos;ve got an answer!
          </p>
          <div className="text-sm font-medium">Solved Graphs</div>
          <ul className="-mt-2 ml-5 list-disc">
            <li className="">
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href='/gemma-2-2b/graph?slug=gemma-fact-dallas-austin&pruningThreshold=0.6&pinnedIds=27_22605_10,20_15589_10,E_26865_9,21_5943_10,23_12237_10,20_15589_9,16_25_9,14_2268_9,18_8959_10,4_13154_9,7_6861_9,19_1445_10,E_2329_7,E_6037_4,0_13727_7,6_4012_7,17_7178_10,15_4494_4,6_4662_4,4_7671_4,3_13984_4,1_1000_4,19_7477_9,18_6101_10,16_4298_10,7_691_10&supernodes=[["capital","15_4494_4","6_4662_4","4_7671_4","3_13984_4","1_1000_4"],["state","6_4012_7","0_13727_7"],["Texas","20_15589_9","19_7477_9","16_25_9","4_13154_9","14_2268_9","7_6861_9"],["preposition+followed+by+place+name","19_1445_10","18_6101_10"],["capital+cities+/+say+a+capital+city","21_5943_10","17_7178_10","7_691_10","16_4298_10"]]&densityThreshold=0.99&clerps=[["23_2312237_10","Cities+and+states+names+(say+Austin)"],["18_1808959_10","state+/+regional+government"]]'
              >
                Fact: The capital of the state containing Dallas is → Austin{' '}
              </Link>
            </li>
            <li>
              The opposite of &quot;small&quot; is → &quot;big&quot; in {` `}
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href='/gemma-2-2b/graph?slug=gemma-small-big-en&clerps=[]&pruningThreshold=0.65&pinnedIds=27_13210_8,E_10498_5,23_8683_8,21_10062_8,17_12530_5,18_9402_8,6_4362_5,15_5617_5,15_5756_5,19_5058_8,14_11360_5,E_13388_2,15_7209_2,4_95_2,3_6576_2,27_7773_8,7_10545_5&supernodes=[["Output+\"big\"+or+\"large\"","27_7773_8","27_13210_8"],["say+big+/+huge+/+large","21_10062_8","23_8683_8"],["opposite","4_95_2","15_7209_2","3_6576_2"],["small","14_11360_5","17_12530_5","15_5617_5"],["large+/+size","6_4362_5","7_10545_5","15_5756_5"]]&clickedId=6_4362_5'
              >
                English
              </Link>
              ,{' '}
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href='/gemma-2-2b/graph?slug=gemma-small-big-fr&pruningThreshold=0.65&pinnedIds=27_21996_8,E_64986_5,24_16045_8,19_5058_8,21_10062_8,23_2592_8,20_1454_8,E_63265_2,23_8683_8,23_8488_8,20_11434_8,19_5802_8,E_1455_7,15_5617_5,18_9402_8,6_4362_5,14_11360_5,3_2908_5,2_5452_5,3_6627_5,6_16184_2,4_95_2,22_10566_8,21_1144_8,E_2025_1,E_581_3&supernodes=[["opposite","6_16184_2","4_95_2"],["say+big+/+large","23_8683_8","23_8488_8","21_10062_8"],["comparatives","19_5058_8","24_16045_8","20_11434_8"],["small","15_5617_5","14_11360_5","3_6627_5","3_2908_5","2_5452_5"],["size","18_9402_8","6_4362_5"],["French","21_1144_8","22_10566_8","20_1454_8","23_2592_8","19_5802_8"]]&clickedId=22_10566_8&densityThreshold=0.99'
              >
                French
              </Link>
              ,{' '}
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href='/gemma-2-2b/graph?slug=gemma-small-big-zh&pruningThreshold=0.65&pinnedIds=27_235469_8,E_235585_2,23_8488_8,23_8683_8,21_10062_8,19_5058_8,22_11933_8,21_9377_8,18_9402_8,15_5617_2,14_11360_2,14_13476_2,2_2169_2,1_10169_2,8_1988_6,4_15846_6,4_7409_6,E_208659_4,E_237379_6,E_236711_5,24_2394_8,23_13630_8,21_13505_8,20_12983_8&supernodes=[["reverse","4_7409_6","8_1988_6","4_15846_6"],["small","15_5617_2","14_11360_2"],["say+big+/+large","23_8683_8","21_10062_8","23_8488_8"],["Chinese","24_2394_8","22_11933_8","20_12983_8","21_13505_8","23_13630_8"],["Chinese-related+English+text","1_10169_2","14_13476_2"],["size","18_9402_8","2_2169_2"],["comparatives","21_9377_8","19_5058_8"]]&clickedId=27_235469_8&densityThreshold=0.99'
              >
                Chinese
              </Link>
            </li>
            <li>
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href='/gemma-2-2b/graph?slug=gemma-girls-are&pinnedIds=27_708_6,25_9974_6,22_11517_6,E_8216_2,E_674_3,E_651_1,19_1880_6,15_13979_6,17_7377_6,18_703_6,16_3689_6,15_4906_6,15_233_6,E_17733_6,3_6616_6,6_11265_6,5_1034_6,4_2671_6,3_6243_4,3_9864_3,0_13503_3&clickedId=3_9864_3&supernodes=[["see/saw","15_233_6","6_11265_6","3_6616_6"],["ends+of+noun+phrases+(predict+a+verb)","19_1880_6","17_7377_6"],["verbs+ending+relative+clauses","4_2671_6","15_4906_6","15_13979_6","18_703_6"],["that","0_13503_3","3_9864_3"]]&pruningThreshold=0.7&densityThreshold=0.99&clerps=[["25_2509974_6","say+are"],["5_501034_6","transitive+verbs+with+objects+preceding+htem"]]'
              >
                The girls that the teacher sees → are
              </Link>
            </li>
          </ul>
          <div className="text-sm font-medium">Unsolved Graphs</div>
          <ul className="-mt-2 ml-5 list-disc">
            <li>
              <Link
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href="/gemma-2-2b/graph?slug=gemma-Mexico-Spanish&clickedId=undefined&pruningThreshold=0.7&densityThreshold=0.99"
              >
                The language most commonly spoken in the country south of the United States is → Spanish
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
                href="/gemma-2-2b/graph?slug=gemma-bee-insect&clerps=[]"
              >
                A bee is a type of → insect
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
                href="/gemma-2-2b/graph?slug=gemma-cat-hat&clerps=[]"
              >
                cat, bat, hat → rat
              </Link>
            </li>
          </ul>
          <p className="mt-1">
            Click <strong>Next</strong> to start the user guide →
          </p>
        </div>
      ),
    },
    {
      number: 1,
      title: 'Top: Choose or Generate a Graph with Custom Prompts',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          <p className="">
            Each graph is generated by showing the model a prompt and examining its internals as it processes each part
            of the prompt.
          </p>
          <p>
            In this example, we&apos;ve chosen a graph where we give the text &quot;The capital of the state containing
            Dallas is&quot;, to see how it comes up with &quot;Austin&quot;.
          </p>
          <p>
            You can <strong>generate your own graph</strong> by clicking on &quot;New Graph&quot; and entering your own
            prompt.
          </p>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Top-Left: Link/Attribution Graph',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          <p className="">
            The link (or attribution) graph at the top left displays the model&apos;s reasoning process as a graph.
            Intermediate steps are represented as nodes, with edges indicating the effect of one node on another.
          </p>
          <p>
            Here, we&apos;ve clicked on a node labeled &quot;Texas&quot; in layer 20, which highlights it with a pink
            border and shows edges connecting to other nodes.
          </p>
          <p>
            The prompt&apos;s <strong>input tokens</strong> are the bottom nodes ({`"<bos>"`}, &quot;Fact&quot;,
            &quot;:&quot;, &quot;The&quot;, etc), and the model&apos;s most likely responses are the{' '}
            <strong>&quot;output&quot; nodes</strong> at the top right ({`"San"`}, &quot;Oklahoma, &quot;Dallas&quot;,
            etc). The nodes in between correspond to ● <strong>features</strong>, which reflect concepts the model
            represents in its internal activations. We also show <strong>◆ error nodes</strong>, which are &quot;missing
            pieces&quot; not captured by our algorithm.
          </p>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Top-Right: Connections',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          <p className="">
            When you click on a ● feature node in the link/attribution graph, you&apos;ll see its label and its
            connected nodes are displayed at the top right panel.
          </p>
          <p>The connected nodes are sorted by weight and separated into input features and output features.</p>
          <p>
            Since we clicked on &quot;Texas&quot; in layer 20, we see the lists of its connected nodes like
            &quot;Dallas&quot;, &quot;state/regional government&quot;, and &quot;Texas legal documents&quot;.
          </p>
        </div>
      ),
    },
    {
      number: 4,
      title: 'Bottom-Left: Subgraph',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          <p className="">
            The subgraph is like a scratchpad for pinning and grouping nodes to make sense of the link graph.
          </p>
          <p>- Hold Command, then click on a node in the link/attribution graph to pin it to the subgraph.</p>
          <p>
            - Hold &quot;g&quot;, then click multiple nodes in the subgraph. When you release &quot;g&quot;,
            they&apos;ll be grouped together into a <strong>supernode</strong>.
          </p>
          <p>- Rename supernodes by clicking on their text label.</p>
          <p>Your subgraph and labels are saved to the URL, so you can share it simply by sharing the URL.</p>
        </div>
      ),
    },
    {
      number: 5,
      title: 'Bottom-Right: Feature Details',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      content: (
        <div className="flex flex-col gap-y-3 text-left text-sm">
          <p className="">
            When you hover over or click a node in any of the panels, its feature details will be displayed here.
          </p>
          <p>
            Here, since we&apos;ve clicked the &quot;Texas&quot; node in the link/attribution graph, we see its top
            activations, logits, feature density, and histogram.
          </p>
          <p>You can also rename labels in the feature details panel, by clicking &quot;Edit Label&quot;.</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    try {
      // Don't show modal on mobile screens (less than 640px width, which is sm breakpoint)
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        return;
      }

      // // Don't show modal on start if we had a slug on first load (user just wanted to go directly to a graph)
      if (hasSlug) {
        return;
      }

      // Don't show modal when in embed mode
      const isEmbed = searchParams.get('embed') === 'true';
      if (isEmbed) {
        return;
      }

      const hasVisited = localStorage.getItem('circuit-tracer-visited');
      if (!hasVisited || ALWAYS_SHOW_WELCOME_MODAL) {
        setIsWelcomeModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, [searchParams]);

  const handleWelcomeClose = () => {
    try {
      localStorage.setItem('circuit-tracer-visited', 'true');
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
    setIsWelcomeModalOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <Dialog open={isWelcomeModalOpen} onOpenChange={handleWelcomeClose}>
      <DialogContent className="w-screen-xl max-w-screen-2xl bg-white text-slate-700">
        <DialogHeader>
          <DialogTitle className="flex w-full flex-row items-center justify-center gap-x-2 text-2xl font-bold">
            <span className="inline-block select-none whitespace-nowrap bg-gradient-to-r from-emerald-700 to-sky-600 bg-clip-text text-transparent">
              Welcome to Circuit Tracer - User Guide
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="text-center text-xs font-medium text-slate-600">
              <strong className="text-sm text-slate-700">How does a language model decide how to respond?</strong>
              <div className="pt-1">
                Interactively trace the internal reasoning steps used by a language model, and generate your own graphs
                with custom prompts.{` `}
                <a
                  href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-800 hover:underline"
                >
                  Ameisen {`'25`}
                </a>
              </div>
            </div>
            <div className="flex flex-row gap-x-3">
              <div className="mt-4 flex w-2/3 flex-col items-center justify-start">
                <img
                  src="/images/explainer.jpg"
                  alt="Attribution graph example showing how a language model traces reasoning from input tokens through intermediate steps to output"
                  className="max-h-full max-w-full rounded-lg border border-slate-200 object-contain shadow-sm"
                />
                <div className="mt-5 flex w-full flex-row justify-between border-t border-slate-200">
                  <div className="flex flex-col justify-start text-left">
                    <h3 className="mb-2 mt-4 text-sm font-medium text-slate-600">Resources for Learning More</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-1">
                        •{' '}
                        <a
                          href="https://github.com/safety-research/circuit-tracer/blob/main/demos/circuit_tracing_tutorial.ipynb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-1 text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          Jupyter notebook
                        </a>{' '}
                        working through two examples on Gemma 2 2B
                      </li>
                      <li className="flex items-start gap-1">
                        •{' '}
                        <a
                          href="https://github.com/safety-research/circuit-tracer/blob/main/demos/circuit_tracing_tutorial.ipynb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-1 text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          circuit-tracer
                        </a>
                        - open source repository for graph generation and interventions to validate graphs
                      </li>
                      <li className="flex items-start gap-1">
                        •{' '}
                        <a
                          href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pl-1 text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          Original research papers
                        </a>
                        that introduced attribution graphs and used them to study{' '}
                        <a
                          href="https://transformer-circuits.pub/2025/attribution-graphs/biology.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          Claude 3.5 Haiku
                        </a>
                        .
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex w-1/3 flex-col">
                {/* Step indicators */}
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToStep(index)}
                      aria-label={`Go to step ${index + 1}: ${step.title}`}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-0 ${
                        index === currentStep
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {step.title}
                    </button>
                  ))}
                </div>

                {/* Current step content */}
                <div className="flex-1 rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-base font-semibold text-slate-700">
                    {/* <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${steps[currentStep].bgColor} text-xs font-bold ${steps[currentStep].textColor}`}
                    >
                      {steps[currentStep].number}
                    </span> */}
                    {steps[currentStep].title}
                  </h3>
                  <div className="text-xs text-slate-600">{steps[currentStep].content}</div>
                </div>

                {/* Navigation buttons */}
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="flex items-center text-sm text-slate-500">
                    {currentStep + 1} of {steps.length}
                  </span>

                  {currentStep === steps.length - 1 ? (
                    <Button size="sm" onClick={handleWelcomeClose} className="flex items-center gap-1">
                      Close
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={nextStep} className="flex items-center gap-1">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function CopyModal() {
  const { isCopyModalOpen, setIsCopyModalOpen } = useGraphContext();

  const handleCopyOption = (type: 'embed' | 'iframe' | 'normal') => {
    const currentUrl = window.location.href;

    switch (type) {
      case 'embed': {
        const url = new URL(currentUrl);
        url.searchParams.set('embed', 'true');
        copy(url.toString());
        alert('Embed link copied to clipboard!');
        break;
      }
      case 'iframe': {
        const url = new URL(currentUrl);
        url.searchParams.set('embed', 'true');
        const iframeCode = `<iframe src="${url.toString()}" width="100%" height="600" frameborder="0"></iframe>`;
        copy(iframeCode);
        alert('Iframe code copied to clipboard!');
        break;
      }
      case 'normal': {
        const url = new URL(currentUrl);
        url.searchParams.delete('embed');
        copy(url.toString());
        alert('URL copied to clipboard!');
        break;
      }
      default:
        break;
    }

    setIsCopyModalOpen(false);
  };

  return (
    <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Graph & Subgraph</DialogTitle>
          <DialogDescription>{`Choose how you'd like to copy this graph for sharing. This will share the graph, your current subgraph, and any custom labels you have created.`}</DialogDescription>
        </DialogHeader>
        <div className="py-22 flex flex-col gap-3">
          <Button
            variant="outline"
            className="h-auto justify-start gap-3 py-3"
            onClick={() => handleCopyOption('normal')}
          >
            <LinkIcon className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Copy Link</div>
              <div className="text-sm text-slate-500">Share as a normal URL</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-start gap-3 py-3"
            onClick={() => handleCopyOption('embed')}
          >
            <CopyIcon className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Copy Embed Link</div>
              <div className="text-sm text-slate-500">URL optimized for iFrame embed</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto justify-start gap-3 py-3"
            onClick={() => handleCopyOption('iframe')}
          >
            <CodeIcon className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Copy iFrame Code</div>
              <div className="text-sm text-slate-500">HTML code snippet to embed this graph</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GraphWrapper({ hasSlug }: { hasSlug: boolean }) {
  const { isLoadingGraphData, selectedMetadataGraph, loadingGraphLabel } = useGraphContext();

  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  return (
    <div
      className={`${isEmbed ? 'h-[calc(100%_-_20px)] max-h-screen min-h-[calc(100%_-_20px)]' : 'h-[calc(100vh_-_75px)] max-h-[calc(100vh_-_75px)] min-h-[calc(100vh_-_75px)]'} flex w-full flex-col justify-center px-4 text-slate-700`}
    >
      <div className="flex w-full flex-col items-center justify-center sm:hidden">
        <div className="mb-2 w-full pt-8 text-center text-sm text-sky-700">
          <span className="text-4xl">⚠️</span>
          <br />
          <br />
          Sorry, attribution graphs have too many intricate visual components to fit on a mobile screen!
          <br />
          <br />
          Please visit this link on a laptop or desktop, or check out these other links:
          <br />
          <br />
          <a
            href="https://github.com/safety-research/circuit-tracer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline"
          >
            Circuit Tracer GitHub Repository
          </a>
          <br />
          <a
            href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline"
          >
            Attribution Graphs: Methods
          </a>
          <br />
          <a
            href="https://transformer-circuits.pub/2025/attribution-graphs/biology.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline"
          >
            Attribution Graphs: Biology
          </a>
          <br />
          <a
            href="https://memicos.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline"
          >
            Back to MemicOS
          </a>
        </div>
      </div>
      <div className="hidden w-full flex-1 flex-col items-center justify-center overflow-hidden sm:flex">
        {/* <div>{JSON.stringify(visState)}</div> */}
        <div className="flex w-full flex-col">
          <GraphToolbar />
        </div>

        <div className="w-full flex-1 overflow-hidden pt-1">
          {isLoadingGraphData ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-3">
              <LoadingSquare className="h-6 w-6" />
              <div className="text-sm text-slate-400">
                {loadingGraphLabel.length > 0 ? loadingGraphLabel : 'Loading...'}
              </div>
            </div>
          ) : selectedMetadataGraph ? (
            <div className="flex h-full max-h-full w-full flex-col">
              <div className="flex h-[50%] max-h-[50%] min-h-[50%] w-full flex-row pb-2">
                <LinkGraph />
                <GraphNodeConnections />
              </div>
              <div className="flex h-[50%] w-full flex-row pb-1 pt-1">
                <div className="w-[53%] min-w-[53%] max-w-[53%]">
                  <Subgraph />
                </div>
                <GraphFeatureDetail />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center text-lg text-slate-400">
                No graph selected. Choose one from the dropdown above.
              </div>
            </div>
          )}
        </div>
      </div>
      <WelcomeModal hasSlug={hasSlug} />
      <CopyModal />
    </div>
  );
}
