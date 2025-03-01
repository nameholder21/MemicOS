'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { useImportContext } from '@/components/provider/import-provider';
import { Button } from '@/components/shadcn/button';
import { useState } from 'react';

interface DownloadButtonProps {
  modelId: string;
  sourceId: string;
}

export default function DownloadButton({ modelId, sourceId }: DownloadButtonProps) {
  const { downloadSource, getImportState, isAnyDownloadRunning } = useImportContext();
  const { getSource } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const importState = getImportState(modelId, sourceId);
  const { isDownloading, error, progress, progressText } = importState;

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await downloadSource(modelId, sourceId);
    } catch (e) {
      // Error is handled by ImportProvider
    } finally {
      setIsLoading(false);
    }
  };

  const isDownloaded = getSource(modelId, sourceId);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isDownloaded ? 'outline' : 'default'}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          handleDownload();
        }}
        disabled={isLoading || isDownloading || isAnyDownloadRunning}
        className="h-7 font-sans"
      >
        {isLoading || isDownloading ? 'Downloading...' : isDownloaded ? 'Re-Sync' : 'Download'}
      </Button>
      {(isLoading || isDownloading) && progressText && (
        <div className="flex flex-col text-xs">
          <span className="text-slate-600">{progressText}</span>
          <span className="text-slate-400">{(progress * 100).toFixed(2)}%</span>
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
