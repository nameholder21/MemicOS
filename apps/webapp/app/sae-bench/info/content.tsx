'use client';

import { useEffect } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CustomTOC } from './custom-toc';
import { markdownData } from './markdown-data';

export function SaebenchInfoContent() {
  useEffect(() => {
    // print the url hashtag if there is one
    const url = window.location.href;
    const hash = url.split('#')[1];
    if (hash === 'unsupervised-metrics' || hash === 'unsupervised-metrics-core') {
      const unsupervisedMetricsElement = document.querySelector('#details-unsupervised-metrics');
      if (unsupervisedMetricsElement) {
        unsupervisedMetricsElement.setAttribute('open', '');
      }
    } else if (hash === 'feature-absorption') {
      const featureAbsorptionElement = document.querySelector('#details-feature-absorption');
      if (featureAbsorptionElement) {
        featureAbsorptionElement.setAttribute('open', '');
      }
    } else if (hash === 'unlearning') {
      const unlearningElement = document.querySelector('#details-unlearning');
      if (unlearningElement) {
        unlearningElement.setAttribute('open', '');
      }
    } else if (hash === 'spurious-correlation-removal-scr') {
      const scrElement = document.querySelector('#details-scr');
      if (scrElement) {
        scrElement.setAttribute('open', '');
      }
    } else if (hash === 'targeted-probe-perturbation-tpp') {
      const tppElement = document.querySelector('#details-tpp');
      if (tppElement) {
        tppElement.setAttribute('open', '');
      }
    } else if (hash === 'automated-interpretability') {
      const automatedInterpretabilityElement = document.querySelector('#details-autointerp');
      if (automatedInterpretabilityElement) {
        automatedInterpretabilityElement.setAttribute('open', '');
      }
    } else if (hash === 'ravel') {
      const ravelElement = document.querySelector('#details-ravel');
      if (ravelElement) {
        ravelElement.setAttribute('open', '');
      }
    } else if (hash === 'sparse-probing') {
      const sparseProbingElement = document.querySelector('#details-sparse-probing');
      if (sparseProbingElement) {
        sparseProbingElement.setAttribute('open', '');
      }
    }
    setTimeout(() => {
      const target = document.querySelector(`#${hash}`);
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
    }, 1000);
  }, []);

  return (
    <div className="flex flex-row gap-x-4 gap-y-4">
      <div className="sticky top-[130px] hidden h-[500px] max-h-[500px] sm:block">
        <CustomTOC markdownString={markdownData} />
      </div>
      <div className="flex flex-1 flex-col">
        <Markdown rehypePlugins={[rehypeRaw, rehypeSlug]} remarkPlugins={[remarkGfm, remarkMath]}>
          {markdownData}
        </Markdown>
      </div>
    </div>
  );
}
