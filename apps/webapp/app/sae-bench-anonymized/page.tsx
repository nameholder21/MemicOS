// This is for anonymized review of SAEBench at saebench.xyz

import { prisma } from '@/lib/db';
import { EvalTypeWithPartialRelations } from '@/prisma/generated/zod';
import { Metadata } from 'next';
import EvalsTable from '../sae-bench/evals-table';

export async function generateMetadata(): Promise<Metadata> {
  const title = `SAE Bench - Anonymous Review`;

  return {
    title,
    description: '',
    openGraph: {
      title,
      description: '',
      url: `/sae-bench`,
    },
  };
}

export default async function Page() {
  let evalTypes = await prisma.evalType.findMany({
    where: {
      featured: true,
    },
    include: {
      evals: {
        select: {
          id: true,
          typeName: true,
          modelId: true,
          sourceId: true,
          source: true,
          output: true,
        },
        // don't include the OLD sae_bench evals
        where: {
          sourceId: {
            not: {
              contains: 'sae_bench-',
            },
          },
        },
      },
    },
  });

  // reorder evalTypes so that type="core" is first
  evalTypes = evalTypes.sort((a, b) => {
    if (a.name === 'core') {
      return -1;
    }
    if (b.name === 'core') {
      return 1;
    }
    if (a.name === 'scr' || a.name === 'tpp') {
      return 1;
    }
    if (b.name === 'scr' || b.name === 'tpp') {
      return -1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="h-full w-full flex-row items-center justify-center gap-x-3 px-0 pt-0 text-slate-600">
        <EvalsTable evalTypes={evalTypes as EvalTypeWithPartialRelations[]} anonymized />
      </div>
    </div>
  );
}
