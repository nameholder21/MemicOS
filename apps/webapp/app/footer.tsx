'use client';

import { CONTACT_EMAIL_ADDRESS, IS_ACTUALLY_MEMICOS_ORG, NEXT_PUBLIC_URL } from '@/lib/env';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.toLowerCase().includes('sae-bench-anonymized')) {
    return <div />;
  }
  return (
    <div className="hidden w-full flex-row items-center justify-between gap-x-5 bg-slate-50 px-5 py-1 text-[11px] text-slate-400 sm:flex">
      <div className="-mt-1.5 hidden flex-row items-center justify-center sm:flex">
        {IS_ACTUALLY_MEMICOS_ORG ? (
          <iframe
            title="MemicOS Status"
            src="https://status.memicos.org/badge?theme=light"
            className="scale-75"
            width="250"
            height="24"
            frameBorder="0"
            scrolling="no"
          />
        ) : (
          <div className="">{NEXT_PUBLIC_URL}</div>
        )}
      </div>
      <div className="flex flex-1 flex-row items-center justify-end gap-x-3 sm:gap-x-5">
        <div className="whitespace-nowrap">© MemicOS 2025</div>
        <Link
          href="/privacy"
          className="flex cursor-pointer items-center whitespace-nowrap px-0 py-0.5 transition-all hover:text-sky-700 hover:underline sm:px-0 sm:py-0"
        >
          Privacy & Terms
        </Link>
        <Link
          href="https://twitter.com/memicos"
          target="_blank"
          rel="noreferrer"
          className="flex cursor-pointer items-center whitespace-nowrap px-0 py-0.5 transition-all hover:text-sky-700 hover:underline sm:px-0 sm:py-0"
        >
          Twitter
        </Link>
        <Link
          href={`mailto:${CONTACT_EMAIL_ADDRESS}?subject=MemicOS`}
          className="flex cursor-pointer items-center whitespace-nowrap px-0 py-0.5 transition-all hover:text-sky-700 hover:underline sm:px-0 sm:py-0"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
