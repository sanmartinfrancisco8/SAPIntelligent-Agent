"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getModuleSummary } from '@/app/actions';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { Module } from '@/lib/sap-modules';
import { Wand2 } from 'lucide-react';

interface ModuleSummaryProps {
  module: Module;
}

export function ModuleSummary({ module }: ModuleSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary('');
    try {
      const functionalityDescription = module.functionalities.map(f => f.name).join(', ');
      const result = await getModuleSummary({ moduleName: module.name, functionalityDescription });
      setSummary(result);
    } catch (e) {
      setError('No se pudo generar el resumen. Inténtelo de nuevo.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generar Resumen
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {summary && (
        <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4 text-foreground">
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
