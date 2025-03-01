'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumbs';
import { Slash } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { Fragment, ReactNode } from 'react';

function isEmptyReactNode(node: ReactNode): boolean {
  return (
    node === null ||
    node === undefined ||
    (typeof node === 'string' && node.trim() === '') ||
    (Array.isArray(node) && node.length === 0)
  );
}

export default function BreadcrumbsComponent({
  rootClasses = '',
  crumbsArray,
}: {
  rootClasses?: string;
  crumbsArray: React.ReactNode[];
}) {
  const searchParams = useSearchParams();
  return (
    <div
      className={`${rootClasses} sticky top-12 z-20 hidden max-h-[36px] w-full flex-row items-center justify-between overflow-hidden border-slate-200 bg-slate-200 px-5 py-2.5 text-slate-600
      ${searchParams.get('embed') !== 'true' && 'sm:flex'}`}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbsArray.map((crumb, index) => {
            if (!isEmptyReactNode(crumb)) {
              return (
                <Fragment key={index}>
                  <BreadcrumbSeparator>
                    <Slash className="text-slate-400" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem className="whitespace-pre">{crumb}</BreadcrumbItem>
                </Fragment>
              );
            }
            return <Fragment key={index} />;
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
