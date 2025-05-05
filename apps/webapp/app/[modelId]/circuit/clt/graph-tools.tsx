import { FilterGraphType, getGraphBaseUrlToName } from '@/app/[modelId]/circuit/clt/clt-utils';
import { useCircuitCLT } from '@/components/provider/circuit-clt-provider';
import { useGlobalContext } from '@/components/provider/global-provider';
import { Button } from '@/components/shadcn/button';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import copy from 'copy-to-clipboard';
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, DownloadIcon, RotateCcw, UploadCloud } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UploadGraphModal from './upload-graph-modal';

export default function GraphTools() {
  const session = useSession();
  const { setSignInModalOpen } = useGlobalContext();
  const {
    modelIdToMetadataMap,
    resetSelectedGraphToDefaultVisState,
    setSelectedModelId,
    selectedModelId,
    selectedMetadataGraph,
    setDefaultMetadataGraph,
    setSelectedMetadataGraph,
    modelIdToModelDisplayName,
    filterGraphsSetting,
    setFilterGraphsSetting,
    shouldShowGraphToCurrentUser,
  } = useCircuitCLT();

  return (
    <div className="flex w-full flex-col pt-2">
      {/* <div className="pb-1 text-[9px] font-medium uppercase text-slate-400">Select a Model and Prompt</div> */}
      <div className="flex w-full flex-row gap-x-2">
        <div className="flex flex-col">
          <div className="w-full pb-0.5 text-center text-[9px] font-medium uppercase text-slate-400">Filter Graphs</div>
          <ToggleGroup.Root
            type="multiple"
            value={filterGraphsSetting}
            onValueChange={(value) => {
              if (value) setFilterGraphsSetting(value as FilterGraphType[]);
            }}
            className="flex h-12 rounded border border-sky-600 bg-slate-50"
          >
            <ToggleGroup.Item
              value={FilterGraphType.Featured}
              aria-label="Only shows your graphs and featured graphs."
              className="w-[86px] rounded-l border-r border-sky-600 px-2.5 text-xs leading-none text-slate-400 data-[state=on]:bg-sky-100 data-[state=on]:text-sky-700 data-[state=off]:hover:bg-slate-100"
            >
              Featured
            </ToggleGroup.Item>

            <ToggleGroup.Item
              value={FilterGraphType.Mine}
              aria-label="Shows only your uploaded graphs."
              className="w-[86px] border-r border-sky-600 px-2.5 text-xs text-slate-400 data-[state=on]:bg-sky-100 data-[state=on]:text-sky-700 data-[state=off]:hover:bg-slate-100"
            >
              Mine
            </ToggleGroup.Item>
            <ToggleGroup.Item
              aria-label="Shows all graphs, including other user uploaded graphs."
              value={FilterGraphType.Community}
              className="w-[86px] rounded-r border-sky-600 px-2.5 text-xs text-slate-400 data-[state=on]:bg-sky-100 data-[state=on]:text-sky-700 data-[state=off]:hover:bg-slate-100"
            >
              Community
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="flex flex-col">
          <div className="w-full pb-0.5 text-center text-[9px] font-medium uppercase text-slate-400">Model</div>
          <Select.Root
            value={selectedModelId}
            onValueChange={(newVal) => {
              setSelectedModelId(newVal);
              setDefaultMetadataGraph(newVal);
            }}
          >
            <Select.Trigger
              onKeyDown={(e) => {
                if (e.key === 'g') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="inline-flex h-12 w-52 max-w-52 items-center justify-between gap-1 rounded border border-slate-300 bg-white px-4 py-2 text-sm leading-none focus:outline-none focus:ring-0"
            >
              <Select.Value>
                {modelIdToModelDisplayName.get(selectedModelId) ? (
                  <div className="flex flex-col items-start justify-start gap-y-0.5 text-left">
                    <div className="text-xs font-medium text-slate-600">
                      {modelIdToModelDisplayName.get(selectedModelId)}
                    </div>
                    <div className="text-[9px] font-normal text-slate-400">{selectedModelId}</div>
                  </div>
                ) : (
                  <div className="text-slate-400">Select a model</div>
                )}
              </Select.Value>
              <Select.Icon>
                <ChevronDownIcon className="w-5 text-slate-500" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                align="center"
                sideOffset={3}
                className="z-[99999] max-h-[400px] overflow-hidden rounded-md border bg-white shadow-lg"
              >
                <Select.ScrollUpButton className="flex h-7 cursor-pointer items-center justify-center bg-white text-slate-700 hover:bg-slate-100">
                  <ChevronUpIcon className="w-5 text-slate-500" />
                </Select.ScrollUpButton>
                <Select.Viewport className="w-full divide-y divide-slate-100 p-2 text-slate-700">
                  {Object.keys(modelIdToMetadataMap).map((modelId) => (
                    <Select.Item
                      key={modelId}
                      value={modelId}
                      className="relative flex h-12 w-full cursor-pointer select-none items-center overflow-x-hidden whitespace-pre rounded py-0 pl-4 pr-6 text-xs hover:bg-slate-100 data-[highlighted]:bg-slate-100 data-[highlighted]:outline-none"
                    >
                      <Select.ItemText className="w-full">
                        <div className="flex w-full flex-col items-start justify-start gap-y-0">
                          <div className="w-full truncate text-left">{modelIdToModelDisplayName.get(modelId)}</div>
                          <div className="w-full text-[9px] font-normal text-slate-400">{modelId}</div>
                        </div>
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-7 cursor-pointer items-center justify-center bg-white text-slate-700 hover:bg-slate-100">
                  <ChevronDownIcon className="w-5 text-slate-500" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="w-full pb-0.5 text-center text-[9px] font-medium uppercase text-slate-400">Graph</div>
          <Select.Root
            value={selectedMetadataGraph?.slug}
            onValueChange={(newVal) => {
              const newGraph = modelIdToMetadataMap[selectedModelId]?.find((graph) => graph.slug === newVal);
              if (newGraph) {
                setSelectedMetadataGraph(newGraph);
              }
            }}
          >
            <Select.Trigger
              onKeyDown={(e) => {
                if (e.key === 'g') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="relative inline-flex h-12 max-w-full items-center justify-between gap-1 overflow-x-hidden rounded border border-slate-300 bg-white px-4 py-2 text-sm leading-none focus:outline-none focus:ring-0"
            >
              {selectedMetadataGraph !== null ? (
                <Select.Value asChild>
                  <div className="flex w-full flex-col items-start justify-start gap-y-0.5 overflow-y-visible">
                    <div className="truncate text-xs font-medium text-slate-600">
                      {selectedMetadataGraph.prompt.replaceAll('\n', ' ').trim()}
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="text-[9px] font-normal text-slate-400">{selectedMetadataGraph.slug}</div>
                      <div className="pr-6 text-[9px] font-normal text-slate-400">
                        {selectedMetadataGraph.user?.name}
                      </div>
                    </div>
                  </div>
                </Select.Value>
              ) : (
                <div className="w-full flex-1 flex-col items-center justify-center text-slate-400">Select a Prompt</div>
              )}
              <Select.Icon className="absolute right-0 w-8 bg-white">
                <ChevronDownIcon className="ml-1 w-5 text-slate-500" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                align="start"
                sideOffset={3}
                className="z-[99999] max-h-[640px] w-full max-w-[800px] overflow-hidden rounded-md border bg-white shadow-lg"
              >
                <Select.ScrollUpButton className="flex h-7 cursor-pointer items-center justify-center bg-white text-slate-700 hover:bg-slate-100">
                  <ChevronUpIcon className="w-5 text-slate-500" />
                </Select.ScrollUpButton>
                <Select.Viewport className="w-full divide-y divide-slate-100 p-2 text-slate-700">
                  {modelIdToMetadataMap[selectedModelId]
                    ?.filter((graph) => shouldShowGraphToCurrentUser(graph))
                    ?.sort((a, b) => {
                      // Sort order:
                      // 1. User's own graphs (alphabetical by slug)
                      // 2. Featured graphs (alphabetical by slug)
                      // 3. Everything else (alphabetical by slug)
                      if (session.data?.user?.id === a.userId && session.data?.user?.id !== b.userId) {
                        return -1;
                      }
                      if (session.data?.user?.id !== a.userId && session.data?.user?.id === b.userId) {
                        return 1;
                      }
                      if (a.isFeatured && !b.isFeatured) {
                        return -1;
                      }
                      if (!a.isFeatured && b.isFeatured) {
                        return 1;
                      }
                      return a.slug.localeCompare(b.slug);
                    })
                    ?.map((graph) => (
                      <Select.Item
                        key={graph.slug}
                        value={graph.slug}
                        className="relative flex w-full min-w-full cursor-pointer select-none items-center overflow-x-hidden rounded py-2.5 pl-4 pr-6 text-xs hover:bg-slate-100 data-[highlighted]:bg-slate-100 data-[highlighted]:outline-none"
                      >
                        <Select.ItemText className="w-full min-w-full" asChild>
                          <div className="flex w-full min-w-full flex-col items-start justify-start gap-y-0">
                            <div className="w-full whitespace-pre-line text-[11px] text-slate-600">
                              {graph.prompt.trim()}
                            </div>
                            <div className="flex w-full min-w-full flex-row items-center justify-between gap-x-5">
                              <div className="text-[9px] font-normal text-slate-400">{graph.slug}</div>
                              <div className="text-[9px] font-normal text-slate-400">
                                {graph.user?.name ? graph.user?.name : getGraphBaseUrlToName(graph.url)}
                              </div>
                            </div>
                          </div>
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  {modelIdToMetadataMap[selectedModelId]?.filter((graph) => shouldShowGraphToCurrentUser(graph))
                    .length === 0 && (
                    <div className="relative w-full cursor-default select-none px-5 py-3 text-center text-sm text-slate-400">
                      No graphs matched your filters. Include more filters on the left.
                    </div>
                  )}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-7 cursor-pointer items-center justify-center bg-white text-slate-700 hover:bg-slate-100">
                  <ChevronDownIcon className="w-5 text-slate-500" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <div className="flex flex-col">
          <div className="w-full pb-0.5 text-center text-[9px] font-medium uppercase text-slate-400">Tools</div>
          <div className="flex flex-row gap-x-2">
            <Button
              variant="outline"
              size="sm"
              title="Reset Graph to Defaults"
              aria-label="Reset Graph to Defaults"
              className="flex h-12 flex-col items-center justify-center gap-y-1.5 whitespace-nowrap border-slate-300 text-[8px] font-medium leading-none text-slate-500 hover:bg-slate-50"
              onClick={() => {
                // eslint-disable-next-line
                if (confirm('Are you sure you want to reset the graph to its default state?')) {
                  resetSelectedGraphToDefaultVisState();
                }
              }}
              disabled={selectedMetadataGraph === null}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Download Graph JSON"
              aria-label="Download Graph JSON"
              className="flex h-12 flex-col items-center justify-center gap-y-1.5 whitespace-nowrap border-slate-300 text-[8px] font-medium leading-none text-slate-500 hover:bg-slate-50"
              onClick={() => {
                if (selectedMetadataGraph) {
                  window.open(selectedMetadataGraph.url, '_blank');
                }
              }}
              disabled={selectedMetadataGraph === null}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Copy Graph URL + State to Clipboard"
              aria-label="Copy Graph URL + State to Clipboard"
              className="flex h-12 items-center justify-center whitespace-nowrap border-slate-300 text-sm text-slate-500 hover:bg-slate-50"
              onClick={() => {
                copy(window.location.href);
                alert('The graph URL state has been copied to clipboard. You can paste it to share with others.');
              }}
              disabled={selectedMetadataGraph === null}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>

            {session.data?.user ? (
              <UploadGraphModal />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex h-12 items-center justify-center border-slate-300"
                onClick={() => {
                  setSignInModalOpen(true);
                }}
              >
                <UploadCloud className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
