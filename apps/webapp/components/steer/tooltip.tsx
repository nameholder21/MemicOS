import CustomTooltip from '@/components/custom-tooltip';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export default function SteerTooltip() {
  return (
    <CustomTooltip
      wide
      trigger={
        <div className="group hidden cursor-pointer flex-col items-center gap-x-1 rounded bg-slate-100 px-0.5 py-0.5 leading-none hover:bg-slate-200 sm:flex">
          <div className="flex flex-row items-center justify-center gap-x-1 px-1.5 py-1 font-sans text-[9px] font-semibold uppercase leading-none text-slate-500">
            <QuestionMarkCircledIcon className="h-3 w-3" />
            How It Works
          </div>
        </div>
      }
    >
      There are many ways to steer a model. Here, we do the following for each feature being steered:
      <ol className="my-3 ml-4 mt-1.5 list-decimal pl-4">
        <li>
          Multiply the <b>steering strength</b> by the <b>strength multiple</b> to get the <b>steering coefficient</b>.
        </li>
        <li>
          Get the <b>steering vector</b> from the SAE, which is the
          {` feature's`} decoder weights.
        </li>
        <li>
          Add the <b>steering coefficient * steering vector</b> to the activations.
        </li>
      </ol>
      In code, it looks like this:
      <code className="mb-3 ml-5 mt-1 flex flex-col">
        <div>steering_coefficient = strength_multiple * steering_strength</div>
        <div>steering_vector = sae.W_dec[feature_index]</div>
        <div>activations += steering_coefficient * steering_vector</div>
      </code>
      In the method we use, a strength_multiple of 0 means no steering will occur.
      <div className="mt-3">
        {`Another variation of steering multiplies the steering vector by the top known activation
              value as well. That's a totally valid method, but here's why
              this version doesn't do this (but we may add it in the future):`}
        <ul className="my-1 ml-4 list-disc pl-4">
          <li className="mb-1">
            {`We may be missing activations for features that are very sparse (or we may not have run
                  enough test prompts during dashboard generation) - and we'd
                  still want to allow steering for those features.`}
          </li>
          <li>
            We want results to be consistent, regardless of what activations are known - eg if someone else steers the
            same feature with the same method (but have different top activations), we want results to be same, or very
            close.
          </li>
        </ul>
      </div>
      <div className="mt-3 flex flex-col gap-x-2.5 gap-y-1">
        Additional Reading{' '}
        <a
          href="https://transformer-circuits.pub/2023/monosemantic-features"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 text-sky-700 hover:underline"
        >
          Anthropic: Towards Monosemanticity
        </a>
        <a
          href="https://www.alignmentforum.org/tag/activation-engineering"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 text-sky-700 hover:underline"
        >
          Alignment Forum: Activation Steering
        </a>
      </div>
    </CustomTooltip>
  );
}
