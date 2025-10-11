'use client';

import { useState } from 'react';
import { setupInitialAdmin } from '@/app/actions';
import { Button } from '@/components/ui/button';

export function SetupAdmin() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const result = await setupInitialAdmin();
      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message);
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Admin Setup</h2>
      <p className="text-sm text-muted-foreground">Create the initial administrator user.</p>
      <Button onClick={handleSetup} disabled={isLoading} className="mt-2">
        {isLoading ? 'Setting up...' : 'Setup Admin'}
      </Button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
