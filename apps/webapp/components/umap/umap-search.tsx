'use client';

import { useUmapContext } from '@/components/provider/umap-provider';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export default function UmapSearch() {
  const { searchText, setSearchText, isSearching, setIsSearching } = useUmapContext();
  const [searchTextDisplay, setSearchTextDisplay] = useState('');

  const toCall = useCallback(
    _.debounce((text: string) => {
      setSearchText(text);
    }, 600),
    [],
  );

  useEffect(() => {
    setSearchTextDisplay(searchText);
  }, [searchText]);

  useEffect(() => {
    if (searchTextDisplay.length > 0) {
      setIsSearching(true);
      toCall(searchTextDisplay);
    } else if (searchText !== '') {
      setIsSearching(false);
      setSearchText('');
    }
  }, [searchTextDisplay, setIsSearching, setSearchText]);

  return (
    <>
      <input
        value={searchTextDisplay}
        onChange={(e) => {
          setSearchTextDisplay(e.target.value);
        }}
        placeholder="Filter Feature Explanations"
        className="w-full rounded-full border-slate-400 px-3 py-1 text-[13px] leading-none text-slate-600 outline-none focus:border-slate-400 focus:outline-none focus:ring-0"
      />
      {isSearching ? (
        <div className="absolute right-[7px] top-[3px] flex h-4 w-4 justify-center text-center">
          <svg
            className="h-5 w-5 animate-spin text-amber-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <button
          type="button"
          className={`${
            searchTextDisplay.length === 0 && 'hidden'
          } absolute right-[7px] top-[5px] flex h-4 w-4 justify-center rounded-full bg-slate-600 text-center text-white`}
          onClick={() => {
            setSearchTextDisplay('');
          }}
        >
          &#x2715;
        </button>
      )}
    </>
  );
}
