'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { getLayerNumAsStringFromSource } from '@/lib/utils/source';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

// this is different from source selector because it just shows the layer number
export default function LayerSelector({
  modelId,
  sourceSet,
  layer = '0',
  layerChangedCallback = () => {},
  filterToInferenceEnabled = false,
}: {
  modelId: string;
  sourceSet: string;
  layer?: string;
  layerChangedCallback?: (layer: string) => void;
  filterToInferenceEnabled?: boolean;
}) {
  const { getSourcesForSourceSet } = useGlobalContext();

  return (
    <div className="flex flex-col">
      <Select.Root
        defaultValue={layer}
        value={layer}
        onValueChange={(newVal) => {
          layerChangedCallback(newVal);
        }}
      >
        <Select.Trigger className="flex h-10 max-h-[40px] min-h-[40px] w-full flex-1 flex-row items-center justify-center gap-x-1 whitespace-pre rounded border border-slate-300 bg-white px-2 font-mono text-sm font-medium text-sky-700 hover:bg-slate-50 focus:outline-none sm:pl-5 sm:pr-2">
          <div className="flex flex-col">
            <Select.Value />
            <div className="mt-0.5 text-center text-[8px] font-medium leading-none text-slate-400">LAYER</div>
          </div>
          <Select.Icon>
            <ChevronDownIcon className="-mr-1 ml-0 w-4 leading-none" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="item-aligned"
            align="center"
            sideOffset={2}
            className="z-30 cursor-pointer overflow-hidden rounded-md border border-slate-300 bg-white text-xs font-medium text-sky-700 shadow"
          >
            <Select.ScrollUpButton className="flex justify-center border-b text-slate-600">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="text-center">
              {getSourcesForSourceSet(modelId, sourceSet, true, filterToInferenceEnabled, false).map((l) => (
                <Select.Item
                  key={l}
                  value={l}
                  className={`overflow-hidden border-b px-3 py-2 font-mono ${
                    layer === l ? 'bg-sky-100 text-sky-700' : 'text-slate-600'
                  } text-xs hover:bg-slate-100 focus:outline-none`}
                >
                  <Select.ItemText>
                    <span className="uppercase">{getLayerNumAsStringFromSource(l)}</span>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex justify-center border-t text-slate-600">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
