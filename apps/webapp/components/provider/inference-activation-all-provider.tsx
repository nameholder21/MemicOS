'use client';

import { NeuronWithPartialRelations } from 'prisma/generated/zod';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from './global-provider';
import createContextWrapper from './provider-util';

export enum InferenceActivationAllState {
  DEFAULT,
  RUNNING,
  LOADED,
}

export type InferenceActivationAllResponse = {
  tokens: string[];
  result: InferenceActivationAllResult[];
  counts?: number[][];
  sortIndexes?: number[];
};

export type InferenceActivationAllResult = {
  modelId: string;
  layer: string;
  index: string;
  values: number[];
  maxValue: number;
  maxValueIndex: number;
  neuron: NeuronWithPartialRelations | undefined;
  dfaValues?: number[] | undefined;
  dfaTargetIndex?: number | undefined;
  dfaMaxValue?: number | undefined;
};

export const [InferenceActivationAllContext, useInferenceActivationAllContext] = createContextWrapper<{
  exploreState: InferenceActivationAllState;
  setExploreState: React.Dispatch<React.SetStateAction<InferenceActivationAllState>>;
  submitSearchAll: (
    modelId: string,
    text: string,
    selectedLayers: string[] | undefined,
    sourceSet: string,
    ignoreBos: boolean,
    sortIndex: number[],
  ) => void;
  tokens: string[];
  setTokens: React.Dispatch<React.SetStateAction<string[]>>;
  overallMaxValue: number;
  searchSortIndexes: number[];
  searchResults: InferenceActivationAllResult[];
  setSearchResults: React.Dispatch<React.SetStateAction<InferenceActivationAllResult[]>>;
  searchCounts: number[][];
  setSearchCounts: React.Dispatch<React.SetStateAction<number[][]>>;
  resultsGrid: (InferenceActivationAllResult | undefined)[][];
  setResultsGrid: React.Dispatch<React.SetStateAction<(InferenceActivationAllResult | undefined)[][]>>;
}>('InferenceActivationAllContext');

export default function InferenceActivationAllProvider({ children }: { children: ReactNode }) {
  const { showToastServerError } = useGlobalContext();
  const [exploreState, setExploreState] = useState<InferenceActivationAllState>(InferenceActivationAllState.DEFAULT);
  const [searchResults, setSearchResults] = useState<InferenceActivationAllResult[]>([]);
  const [searchCounts, setSearchCounts] = useState<number[][]>([]);
  const [searchSortIndexes, setSearchSearchSortIndexes] = useState<number[]>([]);
  const [resultsGrid, setResultsGrid] = useState<(InferenceActivationAllResult | undefined)[][]>([]);
  const [overallMaxValue, setOverallMaxValue] = useState(-10);
  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => {
    if (searchResults.length > 0) {
      let maxVal = -10;
      searchResults.forEach((a) => {
        if (a.maxValue > maxVal) {
          maxVal = a.maxValue;
        }
      });
      setOverallMaxValue(maxVal);
    }
  }, [searchResults]);

  function submitSearchAll(
    modelId: string,
    text: string,
    selectedLayers: string[] | undefined,
    sourceSet: string,
    ignoreBos: boolean,
    sortIndexes: number[] = [],
  ) {
    if (!selectedLayers) {
      alert('Please select at least one layer to search.');
      return;
    }
    setExploreState(InferenceActivationAllState.RUNNING);
    fetch(`/api/search-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId,
        text,
        selectedLayers,
        sortIndexes: sortIndexes as number[],
        sourceSet,
        ignoreBos,
      }),
    })
      .then((response) => response.json())
      .then((resp: InferenceActivationAllResponse) => {
        setExploreState(InferenceActivationAllState.LOADED);
        setSearchResults(resp.result);
        setSearchCounts(resp.counts || []);
        setSearchSearchSortIndexes(resp.sortIndexes || []);
        setTokens(resp.tokens);
      })
      .catch((error) => {
        showToastServerError();
        setExploreState(InferenceActivationAllState.DEFAULT);
        console.error(error);
      });
  }

  return (
    <InferenceActivationAllContext.Provider
      value={useMemo(
        () => ({
          exploreState,
          setExploreState,
          submitSearchAll,
          tokens,
          setTokens,
          searchResults,
          overallMaxValue,
          setSearchResults,
          searchSortIndexes,
          searchCounts,
          setSearchCounts,
          resultsGrid,
          setResultsGrid,
        }),
        [
          exploreState,
          submitSearchAll,
          tokens,
          searchResults,
          overallMaxValue,
          searchSortIndexes,
          searchCounts,
          resultsGrid,
        ],
      )}
    >
      {children}
    </InferenceActivationAllContext.Provider>
  );
}
