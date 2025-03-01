'use client';

import { convertEvalTypeToHash } from '@/app/sae-bench/evals-table';
import { AccordionTrigger } from '@/components/shadcn/accordion';
import { EvalWithPartialRelations } from '@/prisma/generated/zod';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { JSONSchema } from 'json-schema-to-typescript';

export default function SaeEvalAccordionTrigger({
  evalSchema,
  evalItem,
}: {
  evalSchema: JSONSchema;
  evalItem: EvalWithPartialRelations;
}) {
  return (
    <AccordionTrigger className="mb-3 rounded bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 hover:no-underline data-[state=open]:bg-slate-200">
      <div className="flex w-full flex-col items-start gap-y-0">
        <div className="flex w-full flex-row items-center justify-between gap-x-1 text-base">
          {evalSchema.title}{' '}
          <div className="mr-3 flex flex-row items-center gap-x-2">
            {evalItem.type?.url ? (
              <a
                href={evalItem.type?.url}
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                rel="noreferrer"
                className="flex h-5 flex-row items-center justify-center rounded-full bg-slate-400 px-3 py-[1px] text-[9px] font-medium uppercase text-white hover:bg-sky-600"
              >
                EVAL Code
                <ExternalLinkIcon className="ml-1 h-2.5 w-2.5" />
              </a>
            ) : null}
            <a
              href={`/sae-bench/info#${convertEvalTypeToHash(evalItem.typeName)}`}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}
              rel="noreferrer"
              className="flex h-5 flex-row items-center justify-center rounded-full bg-slate-400 px-3 py-[1px] text-[9px] font-medium uppercase text-white hover:bg-sky-600"
            >
              EVAL Details
              <ExternalLinkIcon className="ml-1 h-2.5 w-2.5" />
            </a>
          </div>
        </div>
        <div className="pt-1 text-left text-[11px] font-normal leading-normal text-slate-500">
          {evalSchema.description}
        </div>
      </div>
    </AccordionTrigger>
  );
}
