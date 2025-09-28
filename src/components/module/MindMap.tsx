"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getMindMap } from '@/app/actions';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Wand2 } from 'lucide-react';

interface MindMapProps {
  moduleName: string;
}

export function MindMap({ moduleName }: MindMapProps) {
  const [mindMapData, setMindMapData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setMindMapData('');
    try {
      const result = await getMindMap({ moduleName });
      setMindMapData(result);
    } catch (e) {
      setError('No se pudo generar el mapa mental. Inténtelo de nuevo.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : <Wand2 className="mr-2 h-4 w-4" />}
        Generar Mapa Mental
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {mindMapData && (
        <div className="rounded-md border bg-muted/50 p-4">
          <pre className="text-sm whitespace-pre-wrap font-code">{mindMapData}</pre>
        </div>
      )}
    </div>
  );
}
