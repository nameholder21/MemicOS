'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { Button } from '@/components/shadcn/button';
import { useState } from 'react';

export default function SyncConfigButton() {
  const { refreshGlobal } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-row gap-2 font-sans">
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsLoading(true);
          const response = await fetch('/api/admin/import-config');
          if (response.ok) {
            alert('Config synced!');
            refreshGlobal();
          } else {
            alert('Error syncing config.');
          }
          setIsLoading(false);
        }}
        disabled={isLoading}
        className=""
      >
        {isLoading ? 'Syncing...' : 'Sync Config'}
      </Button>
    </div>
  );
}
