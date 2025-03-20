'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { UNNAMED_AUTHOR_NAME } from '@/lib/utils/general';
import Link from 'next/link';

export default function HomeReleases() {
  const { releases } = useGlobalContext();

  return (
    <div className="forceShowScrollBar flex max-h-[335px] flex-1 flex-col divide-y divide-slate-100 overflow-y-scroll">
      {releases
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
        .filter((release) => release.featured)
        .map((release) => (
          <Link
            key={release.name}
            href={`/${release.name}`}
            prefetch={false}
            className="relative flex w-full flex-col items-start justify-center  gap-x-2 gap-y-0.5 rounded px-3 py-3 pr-5 text-xs font-medium hover:bg-sky-100 hover:text-sky-800"
          >
            <div className="mb-1 text-left font-sans text-[12px] font-bold leading-tight text-sky-700">
              {release.description}
            </div>
            <div className="text-left text-[11px] font-normal leading-tight text-slate-600">
              {release.creatorName !== UNNAMED_AUTHOR_NAME ? `${release.creatorName}` : 'Anonymous Peer Review'}
            </div>
          </Link>
        ))}
    </div>
  );
}
