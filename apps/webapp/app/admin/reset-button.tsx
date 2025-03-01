'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { Button } from '@/components/shadcn/button';
import { useState } from 'react';

export default function ResetButton() {
  const [isResetting, setIsResetting] = useState(false);
  const { refreshGlobal } = useGlobalContext();

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the database? This will delete all data except users.')) {
      return;
    }

    try {
      setIsResetting(true);
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset database');
      }
      alert('Database reset successfully');

      refreshGlobal();
    } catch (error) {
      console.error('Error resetting database:', error);
      alert('Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white"
      onClick={handleReset}
      size="sm"
      disabled={isResetting}
    >
      {isResetting ? 'Resetting...' : 'Reset DB'}
    </Button>
  );
}
