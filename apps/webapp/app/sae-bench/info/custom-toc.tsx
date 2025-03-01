import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shadcn/collapsible';
import { useRouter } from 'next/navigation';
import { fromMarkdown } from 'react-markdown-toc';
import { TOC } from './copied-from-web/toc-client';

export function CustomTOC({ markdownString }: { markdownString: string }) {
  const router = useRouter();
  const toc = fromMarkdown(markdownString);

  return (
    <TOC
      toc={toc}
      scrollAlign="start"
      renderList={(children) => (
        <CollapsibleContent className="overflow-hidden pl-4 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {children}
        </CollapsibleContent>
      )}
      renderListItem={(children) => <Collapsible open>{children}</Collapsible>}
      renderLink={(children, href, active) => (
        <CollapsibleTrigger className="min-w-[270px] max-w-[270px] text-left text-[13px] font-medium text-slate-600">
          <button
            type="button"
            data-active={active}
            className=" hover:text-sky-700 hover:underline"
            onClick={() => {
              router.push(href, { scroll: false });

              if (Array.isArray(children)) {
                const text = children[0];
                if (typeof text === 'string') {
                  if (text === 'Unsupervised Metrics (Core)') {
                    const unsupervisedMetricsElement = document.querySelector('#details-unsupervised-metrics');
                    if (unsupervisedMetricsElement) {
                      unsupervisedMetricsElement.setAttribute('open', '');
                    }
                  } else if (text === 'Feature Absorption') {
                    const featureAbsorptionElement = document.querySelector('#details-feature-absorption');
                    if (featureAbsorptionElement) {
                      featureAbsorptionElement.setAttribute('open', '');
                    }
                  } else if (text === 'Unlearning') {
                    const unlearningElement = document.querySelector('#details-unlearning');
                    if (unlearningElement) {
                      unlearningElement.setAttribute('open', '');
                    }
                  } else if (text === 'Spurious Correlation Removal (SCR)') {
                    const scrElement = document.querySelector('#details-scr');
                    if (scrElement) {
                      scrElement.setAttribute('open', '');
                    }
                  } else if (text === 'Targeted Probe Perturbation (TPP)') {
                    const tppElement = document.querySelector('#details-tpp');
                    if (tppElement) {
                      tppElement.setAttribute('open', '');
                    }
                  } else if (text === 'Automated Interpretability') {
                    const automatedInterpretabilityElement = document.querySelector('#details-autointerp');
                    if (automatedInterpretabilityElement) {
                      automatedInterpretabilityElement.setAttribute('open', '');
                    }
                  } else if (text === 'RAVEL') {
                    const ravelElement = document.querySelector('#details-ravel');
                    if (ravelElement) {
                      ravelElement.setAttribute('open', '');
                    }
                  } else if (text === 'Sparse Probing') {
                    const sparseProbingElement = document.querySelector('#details-sparse-probing');
                    if (sparseProbingElement) {
                      sparseProbingElement.setAttribute('open', '');
                    }
                  }
                }
              }

              const target = document.querySelector(href);
              target?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              });
              const targetTop = target?.getBoundingClientRect().top;
              if (targetTop)
                window.scrollTo({
                  top: window.scrollY + targetTop - 130,
                  behavior: 'smooth',
                });
            }}
          >
            {JSON.stringify(children).includes('SAEBench:') ? 'SAEBench' : children}
          </button>
        </CollapsibleTrigger>
      )}
    />
  );
}
