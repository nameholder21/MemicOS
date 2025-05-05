import { FilterGraphType, getGraphBaseUrlToName } from '@/app/[modelId]/graph/utils';
import { useGlobalContext } from '@/components/provider/global-provider';
import { useGraphContext } from '@/components/provider/graph-provider';
import { Button } from '@/components/shadcn/button';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import copy from 'copy-to-clipboard';
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, DownloadIcon, RotateCcw, UploadCloud } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import UploadGraphModal from './upload-graph-modal';

export default function GraphToolbar() {
  const session = useSession();
  const { setSignInModalOpen } = useGlobalContext();
  const router = useRouter();
  const {
    modelIdToMetadataMap,
    resetSelectedGraphToDefaultVisState,
    selectedModelId,
    selectedMetadataGraph,
    setSelectedMetadataGraph,
    modelIdToModelDisplayName,
    filterGraphsSetting,
    setFilterGraphsSetting,
    shouldShowGraphToCurrentUser,
  } = useGraphContext();

  return (
    <div className="flex w-full flex-col pt-2">
      {/* <div className="pb-1 text-[9px] font-medium uppercase text-slate-400">Select a Model and Prompt</div> */}
      <div className="flex w-full flex-row gap-x-2">
        <div className="flex flex-col">
          <div className="w-full pb-0.5 text-center text-[9px] font-medium uppercase text-slate-400">Model</div>
          <Select.Root
            value={selectedModelId}
            onValueChange={(newVal) => {
              router.replace(`/${newVal}/graph`);
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
              className="relative inline-flex h-12 max-w-full items-center justify-between gap-1 overflow-x-hidden rounded border border-slate-300 bg-white px-4 py-0 pr-10 text-sm leading-none focus:outline-none focus:ring-0"
            >
              {selectedMetadataGraph !== null ? (
                <Select.Value asChild>
                  <div className="flex w-full flex-col items-start justify-start gap-y-1.5 overflow-y-visible">
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="font-mono text-[12px] font-medium text-sky-700">{selectedMetadataGraph.slug}</div>
                      <div className="text-[9px] font-normal text-slate-400">
                        {selectedMetadataGraph.user?.name
                          ? selectedMetadataGraph.user?.name
                          : getGraphBaseUrlToName(selectedMetadataGraph.url)}
                      </div>
                    </div>
                    <div className="text-overflow-ellipsis whitespace-nowrap text-[10px] font-normal leading-none text-slate-500">
                      {/* <span className="rounded bg-slate-200 px-1 py-0.5 text-[8px] font-bold text-slate-600">
                        PROMPT
                      </span>{' '} */}
                      {selectedMetadataGraph.prompt.replaceAll('\n', ' ').trim()}
                    </div>
                  </div>
                </Select.Value>
              ) : (
                <div className="w-full flex-1 flex-col items-center justify-center text-slate-400">Select a Prompt</div>
              )}
              <Select.Icon className="justfiy-center absolute right-0 flex h-[100%] w-8 items-center bg-white">
                <ChevronDownIcon className="ml-1 w-5 text-slate-500" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                align="start"
                sideOffset={3}
                className="z-[99999] max-h-[640px] w-full max-w-[800px] overflow-hidden overscroll-y-none rounded-md border bg-white shadow-lg"
              >
                <Select.Viewport className="w-full p-0 text-slate-700">
                  {(() => {
                    const allVisibleGraphs =
                      modelIdToMetadataMap[selectedModelId]?.filter((graph) => shouldShowGraphToCurrentUser(graph)) ??
                      [];

                    const myGraphs = allVisibleGraphs.filter((graph) => session.data?.user?.id === graph.userId);
                    const featuredGraphs = allVisibleGraphs.filter(
                      (graph) => graph.isFeatured && session.data?.user?.id !== graph.userId,
                    );
                    const communityGraphs = allVisibleGraphs.filter(
                      (graph) => !graph.isFeatured && session.data?.user?.id !== graph.userId,
                    );

                    let graphsDisplayedCount = 0;
                    if (filterGraphsSetting.includes(FilterGraphType.Mine)) graphsDisplayedCount += myGraphs.length;
                    if (filterGraphsSetting.includes(FilterGraphType.Featured))
                      graphsDisplayedCount += featuredGraphs.length;
                    if (filterGraphsSetting.includes(FilterGraphType.Community))
                      graphsDisplayedCount += communityGraphs.length;

                    const renderGraphItem = (graph: (typeof allVisibleGraphs)[0]) => (
                      <Select.Item
                        key={graph.slug}
                        value={graph.slug}
                        className="relative flex w-full min-w-full cursor-pointer select-none items-center overflow-x-hidden py-2.5 pl-4 pr-6 text-xs outline-none hover:bg-slate-100 data-[highlighted]:bg-sky-100"
                      >
                        <Select.ItemText className="w-full min-w-full" asChild>
                          <div className="flex w-full min-w-full flex-col items-start justify-start gap-y-0">
                            <div className="flex w-full flex-row items-center justify-between">
                              <div className="font-mono text-[12px] font-medium text-sky-700">{graph.slug}</div>
                              <div className="text-[9px] font-normal text-slate-400">
                                {graph.user?.name ? graph.user?.name : getGraphBaseUrlToName(graph.url)}
                              </div>
                            </div>
                            <div className="mt-1.5 w-full whitespace-pre-line pl-3 text-[11px] leading-tight text-slate-500">
                              {graph.prompt.trim()}
                            </div>
                          </div>
                        </Select.ItemText>
                      </Select.Item>
                    );

                    return (
                      <>
                        {filterGraphsSetting.includes(FilterGraphType.Mine) && myGraphs.length > 0 && (
                          <Select.Group className="divide-y divide-slate-200">
                            <Select.Label className="sticky top-0 z-10 border-b border-t border-slate-100 bg-slate-50 py-2 pl-4 pr-6 pt-2.5 text-center text-xs font-bold text-slate-500">
                              My Graphs
                            </Select.Label>
                            {myGraphs.sort((a, b) => a.slug.localeCompare(b.slug)).map(renderGraphItem)}
                          </Select.Group>
                        )}
                        {filterGraphsSetting.includes(FilterGraphType.Featured) && featuredGraphs.length > 0 && (
                          <Select.Group className="divide-y divide-slate-200">
                            <Select.Label className="sticky top-0 z-10 border-b border-t border-slate-100 bg-slate-50 py-2 pl-4 pr-6 pt-2.5 text-center text-xs font-bold text-slate-500">
                              Featured Graphs
                            </Select.Label>
                            {featuredGraphs.sort((a, b) => a.slug.localeCompare(b.slug)).map(renderGraphItem)}
                          </Select.Group>
                        )}
                        {filterGraphsSetting.includes(FilterGraphType.Community) && communityGraphs.length > 0 && (
                          <Select.Group className="divide-y divide-slate-200">
                            <Select.Label className="sticky top-0 z-10 border-b border-t border-slate-100 bg-slate-50 py-2 pl-4 pr-6 pt-2.5 text-center text-xs font-bold text-slate-500">
                              Community-Submitted Graphs
                            </Select.Label>
                            {communityGraphs.sort((a, b) => a.slug.localeCompare(b.slug)).map(renderGraphItem)}
                          </Select.Group>
                        )}
                        {graphsDisplayedCount === 0 && (
                          <div className="relative w-full cursor-default select-none px-5 py-3 text-center text-sm text-slate-400">
                            No graphs matched your filters. Include more filters on the left.
                          </div>
                        )}
                      </>
                    );
                  })()}
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
