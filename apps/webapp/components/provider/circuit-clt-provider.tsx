'use client';

import {
  CLTGraph,
  CLTMetadataGraph,
  ModelToCLTMetadataGraphsMap,
  VisState,
  formatCLTGraphData,
  isHideLayer,
  metadataScanToModelDisplayName,
} from '@/app/[modelId]/circuit/clt/clt-utils';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

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

  // visState
  visState: VisState;
  setVisState: (newState: Partial<VisState>) => void;
  updateVisStateField: <K extends keyof VisState>(key: K, value: VisState[K]) => void;

  // logitDiff
  logitDiff: string | null;
  setLogitDiff: (logitDiff: string | null) => void;
};

// Create the context with a default value
const CircuitCLTContext = createContext<CircuitCLTContextType | undefined>(undefined);

export function getGraphUrl(graphSlug: string): string {
  return `https://transformer-circuits.pub/2025/attribution-graphs/graph_data/${graphSlug}.json`;
}

// Provider component
export function CircuitCLTProvider({
  children,
  initialMetadata = {},
  initialClickedId,
  initialLogitDiff,
}: {
  children: ReactNode;
  initialMetadata?: ModelToCLTMetadataGraphsMap;
  initialClickedId?: string;
  initialLogitDiff?: string;
}) {
  const [metadata, setMetadata] = useState<ModelToCLTMetadataGraphsMap>(initialMetadata);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    Object.keys(initialMetadata).length > 0 ? Object.keys(initialMetadata)[0] : '',
  );
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<CLTMetadataGraph | null>(
    selectedModelId && initialMetadata[selectedModelId]?.length > 0 ? initialMetadata[selectedModelId][0] : null,
  );
  const [selectedGraph, setSelectedGraph] = useState<CLTGraph | null>(null);

  // Initialize visState
  const [visState, setVisStateInternal] = useState<VisState>({
    pinnedIds: [],
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
    supernodes: [],
  });

  const [logitDiff, setLogitDiff] = useState<string | null>(initialLogitDiff || null);

  // Update selected metadata graph when model changes
  useEffect(() => {
    if (selectedModelId && metadata[selectedModelId]?.length > 0) {
      setSelectedMetadataGraph(metadata[selectedModelId][0]);
    } else {
      setSelectedMetadataGraph(null);
    }
  }, [selectedModelId, metadata]);

  // When selectedgraph is set, set the correct isHideLayer value
  useEffect(() => {
    if (selectedGraph) {
      // if we have qParams (default queryparams/visstate), parse them as visState and set it
      if (selectedGraph.qParams) {
        const blankVisState: VisState = {
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
          isHideLayer: isHideLayer(selectedGraph.metadata.scan),
          sg_pos: '',
          isModal: true,
          isGridsnap: false,
          supernodes: [],
        };
        // if the qparams has a clickedId, only set it in the visState if it exists in the nodes array
        setVisStateInternal(() => ({
          ...blankVisState,
          ...selectedGraph.qParams,
          clickedId:
            selectedGraph.qParams.clickedId &&
            selectedGraph.nodes.some((d) => d.nodeId === selectedGraph.qParams.clickedId)
              ? selectedGraph.qParams.clickedId
              : null,
        }));
      }
    }
  }, [selectedGraph]);

  // Function to update the entire visState
  const setVisState = (newState: Partial<VisState>) => {
    setVisStateInternal((prevState) => ({ ...prevState, ...newState }));
  };

  // Function to update a single field of visState
  const updateVisStateField = <K extends keyof VisState>(key: K, value: VisState[K]) => {
    setVisStateInternal((prevState) => ({ ...prevState, [key]: value }));
  };

  // Function to fetch graph data
  async function getGraph(graphSlug: string): Promise<CLTGraph> {
    const response = await fetch(getGraphUrl(graphSlug));

    if (!response.ok) {
      throw new Error(`Failed to fetch graph data for ${graphSlug}`);
    }

    const data = (await response.json()) as CLTGraph;
    const formattedData = formatCLTGraphData(data, logitDiff);
    return formattedData;
  }

  // Fetch graph data when selected metadata graph changes
  useEffect(() => {
    if (selectedMetadataGraph) {
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
    }),
    [metadata, selectedModelId, selectedMetadataGraph, selectedGraph, visState, logitDiff],
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
