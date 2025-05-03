'use client';

import {
  CLTFeature,
  CLTGraph,
  CLTGraphNode,
  CltVisState,
  FilterGraphType,
  ModelToGraphMetadatasMap,
  formatCLTGraphData,
  isHideLayer,
  modelIdToModelDisplayName,
  nodeHasFeatureDetail,
} from '@/app/[modelId]/circuit/clt/clt-utils';
import { GraphMetadataWithPartialRelations } from '@/prisma/generated/zod';
import { GraphMetadata } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const FEATURE_DETAIL_DOWNLOAD_BATCH_SIZE = 30;

// Define the context type
type CircuitCLTContextType = {
  modelIdToMetadataMap: ModelToGraphMetadatasMap;
  selectedModelId: string;
  selectedMetadataGraph: GraphMetadataWithPartialRelations | null;
  selectedGraph: CLTGraph | null;
  setSelectedModelId: (modelId: string) => void;
  setSelectedMetadataGraph: (graph: GraphMetadataWithPartialRelations | null) => void;
  setDefaultMetadataGraph: (modelOverride?: string) => void;
  setModelIdToMetadataMap: (metadata: ModelToGraphMetadatasMap) => void;
  getGraph: (graphSlug: string) => Promise<CLTGraph>;
  modelIdToModelDisplayName: Map<string, string>;

  // isLoadingGraphData
  isLoadingGraphData: boolean;
  setIsLoadingGraphData: (isLoading: boolean) => void;

  // visState
  visState: CltVisState;
  setVisState: (newState: Partial<CltVisState>) => void;
  updateVisStateField: <K extends keyof CltVisState>(key: K, value: CltVisState[K]) => void;

  // logitDiff
  logitDiff: string | null;
  setLogitDiff: (logitDiff: string | null) => void;

  // resetSelectedGraphToDefaultVisState
  resetSelectedGraphToDefaultVisState: () => void;

  // isEditingLabel
  isEditingLabel: boolean;
  setIsEditingLabel: (isEditingLabel: boolean) => void;

  // getOverrideClerpForNode
  getOverrideClerpForNode: (node: CLTGraphNode) => string | undefined;

  // Graph filtering setting
  filterGraphsSetting: FilterGraphType[];
  setFilterGraphsSetting: (setting: FilterGraphType[]) => void;
  shouldShowGraphToCurrentUser: (graph: GraphMetadata) => boolean;
};

// Create the context with a default value
const CircuitCLTContext = createContext<CircuitCLTContextType | undefined>(undefined);

export function getGraphUrl(graphSlug: string, baseUrl: string): string {
  const url = `${baseUrl}/graph_data/${graphSlug}.json`;
  return url;
}

async function fetchInBatches<T>(items: any[], fetchFn: (item: any) => Promise<T>, batchSize: number): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batchItems = items.slice(i, i + batchSize);
    const batchPromises = batchItems.map(fetchFn);
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  return results;
}

// Provider component
export function CircuitCLTProvider({
  children,
  initialModelIdToMetadataGraphsMap = {},
  initialModel,
  initialMetadataGraph,
  initialPinnedIds,
  initialClickedId,
  initialSupernodes,
  initialClerps,
}: {
  children: ReactNode;
  initialModelIdToMetadataGraphsMap?: ModelToGraphMetadatasMap;
  initialModel?: string;
  initialMetadataGraph?: GraphMetadata;
  initialPinnedIds?: string;
  initialClickedId?: string;
  initialSupernodes?: string[][];
  initialClerps?: string[][];
}) {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modelIdToMetadataMap, setModelIdToMetadataMap] = useState<ModelToGraphMetadatasMap>(
    initialModelIdToMetadataGraphsMap,
  );
  const [selectedModelId, setSelectedModelId] = useState<string>(
    initialModel ||
      (Object.keys(initialModelIdToMetadataGraphsMap).length > 0
        ? Object.keys(initialModelIdToMetadataGraphsMap)[0]
        : ''),
  );
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<GraphMetadata | null>(
    initialMetadataGraph ||
      (selectedModelId && initialModelIdToMetadataGraphsMap[selectedModelId]?.length > 0
        ? initialModelIdToMetadataGraphsMap[selectedModelId][0]
        : null),
  );
  const [selectedGraph, setSelectedGraph] = useState<CLTGraph | null>(null);
  const [isLoadingGraphData, setIsLoadingGraphData] = useState<boolean>(true);
  const [filterGraphsSetting, setFilterGraphsSetting] = useState<FilterGraphType[]>([
    FilterGraphType.Featured,
    FilterGraphType.Community,
    FilterGraphType.Mine,
  ]);

  useEffect(() => {
    setDefaultMetadataGraph();
  }, [filterGraphsSetting]);

  const hasAppliedInitialOverrides = useRef(false);
  const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);

  const [visState, setVisStateInternal] = useState<CltVisState>({
    pinnedIds: initialPinnedIds ? initialPinnedIds.split(',') : [],
    hiddenIds: [],
    hoveredId: null,
    hoveredNodeId: null,
    hoveredCtxIdx: null,
    clickedId: initialClickedId || null,
    clickedCtxIdx: null,
    linkType: 'both',
    isShowAllLinks: '',
    isSyncEnabled: '',
    subgraph: null,
    isEditMode: 1,
    isHideLayer: false,
    sg_pos: '',
    isModal: true,
    isGridsnap: false,
    supernodes: initialSupernodes || [],
    clerps: initialClerps || [],
  });

  const getOverrideClerpForNode = (node: CLTGraphNode) => {
    const defaultClerp = node.ppClerp;
    if (visState.clerps && visState.clerps.length > 0) {
      const overrideClerp = visState.clerps.find((e) => e[0] === node.featureId);
      return overrideClerp ? overrideClerp[1] : defaultClerp;
    }
    return defaultClerp;
  };

  const getFilterGraphTypeForCurrentUser = (graph: GraphMetadata) => {
    if (session.data?.user?.id === graph.userId) {
      return FilterGraphType.Mine;
    } else if (graph.isFeatured) {
      return FilterGraphType.Featured;
    }
    return FilterGraphType.Community;
  };

  const shouldShowGraphToCurrentUser = (graph: GraphMetadata) => {
    let graphType = getFilterGraphTypeForCurrentUser(graph);
    return filterGraphsSetting.includes(graphType);
  };

  const setDefaultMetadataGraph = (modelOverride?: string) => {
    // based on the filter, find the first graph that matches the filter
    const filteredGraphs = modelIdToMetadataMap[modelOverride || selectedModelId].filter((graph) =>
      filterGraphsSetting.includes(getFilterGraphTypeForCurrentUser(graph)),
    );
    if (filteredGraphs.length > 0) {
      setSelectedMetadataGraph(filteredGraphs[0]);
    } else {
      setSelectedMetadataGraph(null);
    }
  };

  const updateUrlParams = (keysToValues: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(keysToValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // update qParams when visState changes
  useEffect(() => {
    if (selectedGraph) {
      const newParams = {
        model: selectedModelId,
        slug: selectedMetadataGraph?.slug || null,
        pinnedIds: visState.pinnedIds.join(','),
        clickedId: visState.clickedId || null,
        supernodes:
          visState.subgraph && visState.subgraph.supernodes.length > 0
            ? JSON.stringify(visState.subgraph.supernodes)
            : null,
        clerps: visState.clerps && visState.clerps.length > 0 ? JSON.stringify(visState.clerps) : null,
      };
      updateUrlParams(newParams);
    }
  }, [visState]);

  // TODO: this does not seem to be used - but in the original it had it in the url params
  const [logitDiff, setLogitDiff] = useState<string | null>(null);

  const blankVisState = {
    pinnedIds: [],
    hiddenIds: [],
    hoveredId: null,
    hoveredNodeId: null,
    hoveredCtxIdx: null,
    clickedId: null,
    clickedCtxIdx: null,
    linkType: 'both',
    isShowAllLinks: '',
    isSyncEnabled: '',
    subgraph: null,
    isEditMode: 1,
    isHideLayer: false,
    sg_pos: '',
    isModal: true,
    isGridsnap: false,
    supernodes: [],
    clerps: [],
  };

  function getGraphDefaultVisState(graph: CLTGraph) {
    let visStateToReturn: CltVisState = blankVisState;
    visStateToReturn.isHideLayer = isHideLayer(graph.metadata.scan);

    // if we have qParams (default queryparams/visstate), parse them as visState and set it
    if (graph.qParams) {
      visStateToReturn = {
        ...visStateToReturn,
        ...graph.qParams,
        // if the qparams has a clickedId, only set it in the visState if it exists in the nodes array
        clickedId:
          graph.qParams.clickedId && graph.nodes.some((d) => d.nodeId === graph.qParams.clickedId)
            ? graph.qParams.clickedId
            : null,
      };
    }

    return visStateToReturn;
  }

  function resetSelectedGraphToDefaultVisState() {
    // default vis state is either saved qParams or blank
    if (selectedGraph) {
      setVisStateInternal(getGraphDefaultVisState(selectedGraph));
    }
  }

  useEffect(() => {
    if (selectedGraph) {
      const visStateToSet = getGraphDefaultVisState(selectedGraph);

      if (!hasAppliedInitialOverrides.current) {
        console.log('applying initial overrides');
        // apply overrides with each state value from initial values
        // only do this one time (first load from url)
        // we don't want to reapply these values when we switch graphs

        // override pinnedIds
        if (initialPinnedIds) {
          visStateToSet.pinnedIds = initialPinnedIds.split(',');
        }

        // overwrite clickedId
        if (initialClickedId) {
          visStateToSet.clickedId = initialClickedId;
        }

        // override supernodes
        if (initialSupernodes) {
          if (visStateToSet.subgraph) {
            visStateToSet.subgraph.supernodes = initialSupernodes;
          } else {
            visStateToSet.subgraph = {
              supernodes: initialSupernodes,
              sticky: true,
              dagrefy: true,
              activeGrouping: {
                isActive: false,
                selectedNodeIds: new Set(),
              },
            };
          }
        }

        // override clerps
        if (initialClerps) {
          visStateToSet.clerps = initialClerps;
        }

        hasAppliedInitialOverrides.current = true;
      } else {
        console.log('not applying initial overrides');
      }

      setVisStateInternal(visStateToSet);
    }
  }, [selectedGraph]);

  // Function to update the entire visState
  const setVisState = (newState: Partial<CltVisState>) => {
    setVisStateInternal((prevState) => ({ ...prevState, ...newState }));
  };

  // Function to update a single field of visState
  const updateVisStateField = useCallback(<K extends keyof CltVisState>(key: K, value: CltVisState[K]) => {
    setVisStateInternal((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  async function fetchFeatureDetail(modelId: string, feature: number, baseUrl: string): Promise<CLTFeature | null> {
    const response = await fetch(`${baseUrl}/features/${modelId}/${feature}.json`);
    if (!response.ok) {
      console.error(`Failed to fetch feature detail for ${modelId}/${feature}`);
      return null;
    }
    const data = await response.json();
    return data as CLTFeature;
  }

  const getBaseUrlFromUrl = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.origin;
  };

  // Function to fetch graph data
  async function getGraph(graphSlug: string): Promise<CLTGraph> {
    const graph = modelIdToMetadataMap[selectedModelId]?.find((g) => g.slug === graphSlug);
    if (!graph) {
      throw new Error(`Graph not found for ${graphSlug}`);
    }
    const response = await fetch(graph.url);

    if (!response.ok) {
      throw new Error(`Failed to fetch graph data for ${graphSlug}`);
    }

    const data = (await response.json()) as CLTGraph;
    const formattedData = formatCLTGraphData(data, logitDiff);

    const featureDetails = await fetchInBatches(
      formattedData.nodes,
      (d) => {
        if (nodeHasFeatureDetail(d)) {
          return fetchFeatureDetail(selectedModelId, d.feature, getBaseUrlFromUrl(graph.url));
        }
        return Promise.resolve(null);
      },
      FEATURE_DETAIL_DOWNLOAD_BATCH_SIZE,
    );

    formattedData.nodes.forEach((d, i) => {
      // eslint-disable-next-line no-param-reassign
      d.featureDetail = featureDetails[i] || undefined;
    });

    setIsLoadingGraphData(false);
    return formattedData;
  }

  // Fetch graph data when selected metadata graph changes
  useEffect(() => {
    if (selectedMetadataGraph) {
      setIsLoadingGraphData(true);
      getGraph(selectedMetadataGraph.slug).then((g) => {
        setSelectedGraph(g);
      });
    } else {
      updateUrlParams({
        model: selectedModelId,
        slug: null,
      });
      setSelectedGraph(null);
    }
  }, [selectedMetadataGraph]);

  // Provide the context value
  const contextValue = useMemo(
    () => ({
      modelIdToMetadataMap,
      selectedModelId,
      selectedMetadataGraph,
      setDefaultMetadataGraph,
      selectedGraph,
      setSelectedModelId,
      setSelectedMetadataGraph,
      setModelIdToMetadataMap,
      getGraph,
      modelIdToModelDisplayName,
      visState,
      setVisState,
      updateVisStateField,
      logitDiff,
      setLogitDiff,
      isLoadingGraphData,
      setIsLoadingGraphData,
      resetSelectedGraphToDefaultVisState,
      isEditingLabel,
      setIsEditingLabel,
      getOverrideClerpForNode,
      filterGraphsSetting,
      setFilterGraphsSetting,
      shouldShowGraphToCurrentUser,
    }),
    [
      modelIdToMetadataMap,
      selectedModelId,
      selectedMetadataGraph,
      setDefaultMetadataGraph,
      selectedGraph,
      visState,
      logitDiff,
      updateVisStateField,
      isLoadingGraphData,
      setIsLoadingGraphData,
      resetSelectedGraphToDefaultVisState,
      isEditingLabel,
      setIsEditingLabel,
      getOverrideClerpForNode,
      filterGraphsSetting,
      shouldShowGraphToCurrentUser,
    ],
  );

  return <CircuitCLTContext.Provider value={contextValue}>{children}</CircuitCLTContext.Provider>;
}

// Custom hook to use the context
export function useCircuitCLT() {
  const context = useContext(CircuitCLTContext);
  if (context === undefined) {
    throw new Error('useCircuitCLT must be used within a CircuitCLTProvider');
  }
  return context;
}
