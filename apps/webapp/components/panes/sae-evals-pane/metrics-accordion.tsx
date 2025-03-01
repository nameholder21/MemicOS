import CustomTooltip from '@/components/custom-tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import { JSONSchema } from 'json-schema-to-typescript';

export default function SaeEvalMetricsAccordion({
  output,
  evalConfigSchema,
  evalMetricsSchema,
  showBothWide = false,
}: {
  output: JSONSchema;
  evalConfigSchema: Record<string, any>;
  evalMetricsSchema: Record<string, any>;
  showBothWide?: boolean;
}) {
  return (
    // @ts-ignore
    <Accordion
      type={showBothWide ? 'multiple' : 'single'}
      collapsible={showBothWide ? false : undefined}
      className={`${showBothWide ? 'flex w-full flex-row gap-x-3' : 'basis-1/3'}`}
      defaultValue={showBothWide ? ['configuration', 'metrics'] : 'metrics'}
    >
      <AccordionItem value="configuration" className={`${showBothWide ? 'basis-1/2' : ''}`}>
        <AccordionTrigger className="mb-1 w-full rounded bg-slate-100 px-2 py-1.5 text-xs data-[state=open]:bg-slate-200">
          Configuration
        </AccordionTrigger>
        <AccordionContent className="flex-1">
          {Object.keys(output.eval_config)
            .sort()
            // .filter((key) => evalConfigSchema?.[key]?.[EVAL_UI_DEFAULT_DISPLAY])
            .map((key) => (
              <div
                key={key}
                className="group flex cursor-default flex-row items-center justify-between gap-x-5 rounded px-3 py-[6px] odd:bg-slate-50 hover:bg-slate-200"
              >
                <CustomTooltip
                  trigger={
                    <div className="group flex w-full flex-row items-center justify-between gap-x-1.5 font-sans text-[11px] font-medium leading-snug text-slate-500 hover:bg-slate-200">
                      {evalConfigSchema?.[key]?.title}
                    </div>
                  }
                >
                  {evalConfigSchema?.[key]?.description}
                </CustomTooltip>
                <div className="text-right font-mono text-[11px] font-bold leading-snug text-slate-600">
                  {Array.isArray(output.eval_config[key]) && output.eval_config[key].every(Number.isInteger) ? (
                    JSON.stringify(output.eval_config[key])
                  ) : Array.isArray(output.eval_config[key]) ? (
                    <div className="flex flex-col">
                      {output.eval_config[key].map((item) => (
                        <div key={item.toString()}>{item.toString()}</div>
                      ))}
                    </div>
                  ) : typeof output.eval_config[key] === 'object' ? (
                    <CustomTooltip wide trigger={<div>Hover to View</div>}>
                      <pre className="text-[11px]">{JSON.stringify(output.eval_config[key], null, 2)}</pre>
                    </CustomTooltip>
                  ) : (
                    output.eval_config[key]?.toString()
                  )}
                </div>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="metrics" className={`${showBothWide ? 'basis-1/2' : 'mt-2'}`}>
        <AccordionTrigger className="mb-1 w-full rounded bg-slate-100 px-2 py-1.5 text-xs data-[state=open]:bg-slate-200">
          Metrics
        </AccordionTrigger>
        <AccordionContent className="w-full flex-1">
          {Object.keys(output.eval_result_metrics)
            .sort()
            .map((key) => (
              <div key={key} className="flex w-full flex-col rounded py-1 pl-3 odd:bg-slate-50">
                {Object.keys(evalMetricsSchema).length === 1 ? (
                  ''
                ) : (
                  <CustomTooltip
                    trigger={
                      <div className="group flex cursor-default flex-row items-center gap-x-1.5 px-0 font-sans text-[10px] font-medium text-slate-400">
                        {evalMetricsSchema?.[key]?.title}
                      </div>
                    }
                  >
                    {evalMetricsSchema?.[key]?.description}
                  </CustomTooltip>
                )}
                {Object.keys(output.eval_result_metrics[key] as object).map((subKey) => (
                  <CustomTooltip
                    key={subKey}
                    trigger={
                      <div className="group flex cursor-default flex-row items-center justify-between gap-x-5 rounded px-3 py-[3px]  hover:bg-slate-200">
                        <div className="group flex cursor-default flex-row items-center gap-x-1.5 px-0 font-sans text-[11px] font-medium text-slate-500">
                          {evalMetricsSchema?.[key]?.properties?.[subKey]?.title}
                        </div>

                        <div className="text-right font-mono text-[11px] font-bold text-slate-600">
                          {evalMetricsSchema?.[key]?.properties?.[subKey]?.type === 'integer'
                            ? (output.eval_result_metrics[key] as Record<string, number>)[subKey]?.toLocaleString()
                            : (output.eval_result_metrics[key] as Record<string, number>)[subKey]
                                ?.toFixed(2)
                                .toLocaleString()}
                        </div>
                      </div>
                    }
                  >
                    {evalMetricsSchema?.[key]?.properties?.[subKey]?.description}
                  </CustomTooltip>
                ))}
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
