'use client';

import {
  CLTFeature,
  CLTGraph,
  CLTMetadataGraph,
  CltVisState,
  ModelToCLTMetadataGraphsMap,
  formatCLTGraphData,
  isHideLayer,
  makeCltFetchUrl,
  metadataScanToModelDisplayName,
  nodeHasFeatureDetail,
} from '@/app/[modelId]/circuit/clt/clt-utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const FEATURE_DETAIL_DOWNLOAD_BATCH_SIZE = 30;

// Define the context type
type CircuitCLTContextType = {
  metadata: ModelToCLTMetadataGraphsMap;
  selectedModelId: string;
  selectedMetadataGraph: CLTMetadataGraph | null;
  selectedGraph: CLTGraph | null;
  setSelectedModelId: (modelId: string) => void;
  setSelectedMetadataGraph: (graph: CLTMetadataGraph | null) => void;
  setMetadata: (metadata: ModelToCLTMetadataGraphsMap) => void;
  getGraph: (graphSlug: string) => Promise<CLTGraph>;
  metadataScanToModelDisplayName: Map<string, string>;
  modelToBaseUrlMap: Record<string, string>;

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
};

// Create the context with a default value
const CircuitCLTContext = createContext<CircuitCLTContextType | undefined>(undefined);

export function getGraphUrl(graphSlug: string, baseUrl: string): string {
  const url = makeCltFetchUrl(baseUrl, `graph_data/${graphSlug}.json`);
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
  modelToBaseUrlMap = {},
  initialMetadata = {},
  initialModel,
  initialMetadataGraph,
  initialPinnedIds,
  initialClickedId,
  initialSupernodes,
}: {
  children: ReactNode;
  modelToBaseUrlMap?: Record<string, string>;
  initialMetadata?: ModelToCLTMetadataGraphsMap;
  initialModel?: string;
  initialMetadataGraph?: CLTMetadataGraph;
  initialPinnedIds?: string;
  initialClickedId?: string;
  initialSupernodes?: string[][];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [metadata, setMetadata] = useState<ModelToCLTMetadataGraphsMap>(initialMetadata);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    initialModel || (Object.keys(initialMetadata).length > 0 ? Object.keys(initialMetadata)[0] : ''),
  );
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<CLTMetadataGraph | null>(
    initialMetadataGraph ||
      (selectedModelId && initialMetadata[selectedModelId]?.length > 0 ? initialMetadata[selectedModelId][0] : null),
  );
  const [selectedGraph, setSelectedGraph] = useState<CLTGraph | null>(null);
  const [isLoadingGraphData, setIsLoadingGraphData] = useState<boolean>(true);

  const hasAppliedInitialOverrides = useRef(false);

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
  });

  const updateParams = (keysToValues: Record<string, string | null>) => {
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
      };
      updateParams(newParams);
    }
  }, [visState]);

  // TODO: this does not seem to be used - but in the original it had it in the url params
  const [logitDiff, setLogitDiff] = useState<string | null>(null);

  function getGraphDefaultVisState(graph: CLTGraph) {
    let visStateToReturn: CltVisState = {
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
      isHideLayer: isHideLayer(graph.metadata.scan),
      sg_pos: '',
      isModal: true,
      isGridsnap: false,
      supernodes: [],
    };

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
    const response = await fetch(makeCltFetchUrl(baseUrl, `features/${modelId}/${feature}.json`));
    if (!response.ok) {
      console.error(`Failed to fetch feature detail for ${modelId}/${feature}`);
      return null;
    }
    const data = await response.json();
    return data as CLTFeature;
  }

  // Function to fetch graph data
  async function getGraph(graphSlug: string): Promise<CLTGraph> {
    const response = await fetch(getGraphUrl(graphSlug, modelToBaseUrlMap[selectedModelId]));

    if (!response.ok) {
      throw new Error(`Failed to fetch graph data for ${graphSlug}`);
    }

    const data = (await response.json()) as CLTGraph;
    const formattedData = formatCLTGraphData(data, logitDiff);

    const featureDetails = await fetchInBatches(
      formattedData.nodes,
      (d) => {
        if (nodeHasFeatureDetail(d)) {
          return fetchFeatureDetail(selectedModelId, d.feature, modelToBaseUrlMap[selectedModelId]);
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
    }
  }, [selectedMetadataGraph]);

  // Provide the context value
  const contextValue = useMemo(
    () => ({
      metadata,
      selectedModelId,
      selectedMetadataGraph,
      selectedGraph,
      modelToBaseUrlMap,
      setSelectedModelId,
      setSelectedMetadataGraph,
      setMetadata,
      getGraph,
      metadataScanToModelDisplayName,
      visState,
      setVisState,
      updateVisStateField,
      logitDiff,
      setLogitDiff,
      isLoadingGraphData,
      setIsLoadingGraphData,
      resetSelectedGraphToDefaultVisState,
    }),
    [
      metadata,
      selectedModelId,
      selectedMetadataGraph,
      selectedGraph,
      visState,
      logitDiff,
      updateVisStateField,
      isLoadingGraphData,
      setIsLoadingGraphData,
      resetSelectedGraphToDefaultVisState,
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
