'use client';

import { Button } from '@/components/shadcn/button';
import { useState } from 'react';

export default function ExplanationCountButton({ modelId, sourceId }: { modelId: string; sourceId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCount = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/info?modelId=${modelId}&sourceId=${sourceId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCount(data.count);
      }
    } catch (e) {
      setError('Failed to fetch count');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={fetchCount} disabled={isLoading} className="h-7 px-2 text-xs">
        {isLoading ? '...' : count === null ? 'Get Count' : count}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
