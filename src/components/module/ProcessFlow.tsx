"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProcessFlow } from '@/app/actions';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { Functionality } from '@/lib/sap-modules';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';

interface ProcessFlowProps {
  functionalities: Functionality[];
}

export function ProcessFlow({ functionalities }: ProcessFlowProps) {
  const [diagram, setDiagram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFunctionality, setSelectedFunctionality] = useState<string | undefined>(undefined);

  const handleGenerate = async () => {
    if (!selectedFunctionality) {
      setError('Por favor, seleccione una funcionalidad.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDiagram('');
    
    try {
      const result = await getProcessFlow({ functionality: selectedFunctionality });
      setDiagram(result);
    } catch (e) {
      setError('No se pudo generar el diagrama. Inténtelo de nuevo.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Select onValueChange={setSelectedFunctionality} value={selectedFunctionality}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Seleccione una funcionalidad" />
          </SelectTrigger>
          <SelectContent>
            {functionalities.map((func) => (
              <SelectItem key={func.id} value={func.name}>
                {func.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={isLoading || !selectedFunctionality}>
          {isLoading ? <LoadingSpinner /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generar Diagrama
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {isLoading && (
        <div className="flex justify-center items-center rounded-lg border-2 border-dashed h-96 w-full">
            <div className='text-center space-y-2'>
                <LoadingSpinner size={32}/>
                <p className='text-muted-foreground'>Generando diagrama...</p>
            </div>
        </div>
      )}

      {diagram && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={diagram}
            alt={`Diagrama de flujo para ${selectedFunctionality}`}
            fill
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
