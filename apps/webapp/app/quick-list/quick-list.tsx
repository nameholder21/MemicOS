'use client';

import UmapSelectedItem from '@/components/umap/umap-selected-item';
import { NeuronIdentifier } from '@/lib/utils/neuron-identifier';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LayoutDashboard, List as ListIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NeuronWithPartialRelations } from 'prisma/generated/zod';
import { useState } from 'react';

export default function QuickList({ name, features }: { name: string; features: NeuronWithPartialRelations[] }) {
  const [listView, setListView] = useState(false);

  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center gap-x-1 gap-y-2 px-3 xl:gap-x-2">
      {!isEmbed && (
        <div className="mb-2 flex w-full max-w-screen-xl flex-row gap-x-1 text-[11px] text-slate-300">
          <a href="/" className="flex text-slate-500 hover:underline">
            Home
          </a>
          <div>&#8226;</div>
          <div className="flex text-slate-500 hover:underline">Quick List</div>
          <div>&#8226;</div>
          <div className="flex text-slate-500 hover:underline">{name}</div>
        </div>
      )}
      <div className="mb-1 flex w-full max-w-screen-xl flex-row items-center justify-between sm:mb-3">
        <div className="flex flex-row items-center gap-x-2.5">
          <div className="flex flex-col text-left">
            <div className="flex-1 text-sm font-medium sm:text-base">
              {name} <span className="text-slate-400">({features.length})</span>
            </div>
          </div>
        </div>
        <ToggleGroup.Root
          className="inline-flex h-9 overflow-hidden rounded border-slate-300 bg-slate-200 px-0 py-0 sm:rounded"
          type="single"
          defaultValue={listView ? 'listView' : 'detailView'}
          value={listView ? 'listView' : 'detailView'}
          onValueChange={(value) => {
            setListView(value === 'listView');
          }}
        >
          <ToggleGroup.Item
            key="listView"
            className="flex flex-auto flex-row items-center gap-x-1.5 px-3 py-1 text-[10px] font-medium text-slate-500 transition-all hover:bg-sky-200 data-[state=on]:bg-sky-300 data-[state=on]:text-slate-700 sm:px-4  sm:text-[11px]"
            value="listView"
            aria-label="listView"
          >
            <ListIcon className="hidden h-4 w-4 sm:flex" />
            List View
          </ToggleGroup.Item>
          <ToggleGroup.Item
            key="detailView"
            className="flex flex-auto flex-row items-center gap-x-1.5 px-3 py-1 text-[10px] font-medium text-slate-500 transition-all hover:bg-sky-200 data-[state=on]:bg-sky-300 data-[state=on]:text-slate-700 sm:px-4  sm:text-[11px]"
            value="detailView"
            aria-label="detailView"
          >
            <LayoutDashboard className="hidden h-4 w-4 sm:flex" /> Detail View
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className="flex w-full max-w-screen-xl flex-col gap-x-3 sm:flex-row">
        <div className="flex flex-col items-start justify-start gap-y-1 pb-2 text-slate-600">
          {listView ? (
            <div className="table w-full table-auto">
              <thead>
                <tr className="text-left text-[12px] font-normal text-slate-400">
                  <th className="px-2 pb-2 font-normal ">Neuron</th>
                  <th className="px-2 pb-2 font-normal ">Explanation</th>
                  <th className="px-2 pb-2 font-normal ">Activation Density</th>
                </tr>
              </thead>
              {features.map((feature, index) => {
                const neuron = feature;
                return (
                  <tr key={index} className="rounded text-left text-sm">
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/${neuron?.modelId}/${neuron?.layer}/${neuron?.index}`, '_blank', 'noreferrer');
                      }}
                      className="cursor-pointer whitespace-pre px-1 py-2.5 align-middle font-mono text-[10px] font-medium uppercase text-sky-800 hover:text-sky-700 sm:px-2 sm:text-xs"
                    >
                      <span className="hidden sm:inline-block">{neuron?.modelId}@</span>
                      {neuron?.layer}:{neuron?.index}
                    </td>
                    <td className="px-1 py-2.5 text-left align-middle text-[11px] font-medium leading-tight text-slate-600 sm:px-2 sm:text-xs">
                      {neuron?.explanations && neuron?.explanations.length > 0 && neuron?.explanations[0].description}
                    </td>
                    <td className="px-1 py-2.5 text-left align-middle text-[11px] font-medium leading-tight text-slate-600 sm:px-2 sm:text-xs">
                      {((neuron?.frac_nonzero ? neuron?.frac_nonzero || 0 : 0) * 100).toFixed(3)}%
                    </td>
                  </tr>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full max-w-screen-xl flex-row gap-x-2 overflow-x-scroll">
              {features.map((feature) => (
                <UmapSelectedItem
                  feature={new NeuronIdentifier(feature.modelId, feature.layer, feature.index)}
                  listItem={{
                    isEditing: false,
                    description: '',
                    neuron: feature,
                  }}
                  key={`${feature.modelId}-${feature.layer}-${feature.index}`}
                  hideDescription
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
