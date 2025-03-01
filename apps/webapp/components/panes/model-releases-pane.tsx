'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ModelWithPartialRelations } from '@/prisma/generated/zod';
import { Visibility } from '@prisma/client';
import Link from 'next/link';

export default function ModelReleasesPane({
  model,
  onlyFeatured,
  includeUnlisted,
}: {
  model: ModelWithPartialRelations;
  onlyFeatured?: boolean;
  includeUnlisted?: boolean;
}) {
  const { releases } = useGlobalContext();

  const getReleasesForModelId = (modelId: string) =>
    releases
      .filter((r) => {
        if (onlyFeatured) {
          return r.featured;
        }
        return true;
      })
      .filter((r) => {
        if (!includeUnlisted) {
          return r.visibility === Visibility.PUBLIC;
        }
        return true;
      })
      .filter((r) => r.sourceSets?.some((ss) => ss.modelId === modelId))
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-1">
        <CardTitle>Releases</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="forceShowScrollBar max-h-[280px] w-full overflow-y-scroll">
        {getReleasesForModelId(model.id).map((r, i) => (
          <Link
            href={`/${r.name}`}
            prefetch={false}
            key={r.name}
            className={` ${
              i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
            } group flex w-full flex-1 cursor-pointer flex-row items-center justify-between gap-x-1 rounded-md px-5 py-3 text-xs font-medium hover:bg-sky-100  hover:text-slate-600 focus:outline-none data-[state=open]:bg-sky-100 data-[state=open]:text-slate-600`}
          >
            <div className="flex w-full flex-col items-start justify-center gap-y-1.5 leading-tight">
              <div className="flex w-full flex-row items-center justify-between gap-x-5 text-[10.5px] text-sky-700 group-hover:text-sky-700 group-data-[state=open]:text-sky-700">
                <div className="font-sans text-[13px] font-medium capitalize text-slate-700  group-hover:text-slate-700 group-data-[state=open]:text-slate-700 ">
                  {r.description}
                </div>
                <div className="whitespace-pre font-medium  text-slate-400">
                  {r.createdAt?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-x-5 text-[11px] text-sky-700 group-hover:text-sky-700 group-data-[state=open]:text-sky-700">
                <div className="text-xs font-medium text-slate-400">{r.creatorNameShort}</div>
                <div className="whitespace-pre font-mono font-medium uppercase">{r?.name}</div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
