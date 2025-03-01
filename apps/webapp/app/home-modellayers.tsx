'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { UNNAMED_AUTHOR_NAME } from '@/lib/utils/general';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MAX_SOURCERELEASES = 6;

export default function HomeModelLayers() {
  const { releases } = useGlobalContext();

  return (
    <div className="mt-2 flex flex-col gap-x-3 gap-y-4 sm:flex-row">
      <div className="grid grid-cols-1 gap-x-2 gap-y-0 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-1">
        {releases
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
          .filter((release) => release.featured)
          .slice(0, MAX_SOURCERELEASES)
          .map((release) => (
            <Link
              key={release.name}
              href={`/${release.name}`}
              prefetch={false}
              rel="noreferrer"
              className="relative mb-2 flex flex-col items-start justify-center gap-x-2 gap-y-0.5 rounded bg-sky-300 px-5 py-3 text-xs font-medium text-sky-700 shadow transition-all hover:bg-sky-400 hover:text-sky-800 disabled:opacity-50 lg:h-20"
            >
              <ArrowUpRight className="absolute right-1 top-1 h-4 w-4" />
              <div className="mb-1 text-left font-sans text-[12px] font-bold leading-tight text-sky-800">
                {release.description}
              </div>
              <div className="text-left text-[11px] font-medium leading-tight text-sky-700">
                {release.creatorName !== UNNAMED_AUTHOR_NAME ? `${release.creatorName}` : 'Anonymous Peer Review'}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
