
"use client";

import type { Module, Functionality } from '@/lib/sap-modules';
import { modules } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { getModuleSummary, getMindMap, getProcessFlow } from '@/app/actions';
import { Button } from '../ui/button';
import { Wand2 } from 'lucide-react';
import { LoadingSpinner } from '../loading-spinner';
import Image from 'next/image';
import { Separator } from '../ui/separator';

type GenerationType = 'summary' | 'mind-map' | 'process-flow';
type ResultData = string | null;

export function KnowledgeProcessingToolkit() {
  const [selectedModule, setSelectedModule] = useState<Module | undefined>(undefined);
  const [selectedFunctionality, setSelectedFunctionality] = useState<Functionality | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData>(null);
  const [resultType, setResultType] = useState<GenerationType | null>(null);
  const [activeTab, setActiveTab] = useState<GenerationType>('summary');

  const handleModuleChange = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    setSelectedModule(mod);
    setSelectedFunctionality(mod?.functionalities[0]); // Reset functionality
    setResult(null);
    setError(null);
  };

  const handleFunctionalityChange = (functionalityName: string) => {
    const func = selectedModule?.functionalities.find(f => f.name === functionalityName);
    setSelectedFunctionality(func);
  };

  const handleGenerate = async () => {
    if (!selectedModule) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setResultType(activeTab);

    try {
      let data: ResultData = null;
      if (activeTab === 'summary') {
        const functionalityDescription = selectedModule.functionalities.map(f => f.name).join(', ');
        data = await getModuleSummary({ moduleName: selectedModule.name, functionalityDescription });
      } else if (activeTab === 'mind-map') {
        data = await getMindMap({ moduleName: selectedModule.name });
      } else if (activeTab === 'process-flow') {
        if (!selectedFunctionality) {
          throw new Error('Por favor, seleccione una funcionalidad.');
        }
        data = await getProcessFlow({ functionality: selectedFunctionality.name });
      }
      setResult(data);
    } catch (e: any) {
      setError(`No se pudo generar el resultado. ${e.message || 'Inténtelo de nuevo.'}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getButtonText = () => {
    switch (activeTab) {
      case 'summary': return 'Generar Resumen';
      case 'mind-map': return 'Generar Mapa Mental';
      case 'process-flow': return 'Generar Diagrama';
      default: return 'Generar';
    }
  }

  const isGenerateDisabled = isLoading || !selectedModule || (activeTab === 'process-flow' && !selectedFunctionality);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Controles de Estudio</CardTitle>
          <CardDescription>Seleccione un módulo y una herramienta para generar contenido con IA.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-6">
          <div>
            <label htmlFor="module-select" className="text-sm font-medium mb-2 block">Seleccione un Módulo</label>
            <Select onValueChange={handleModuleChange}>
                <SelectTrigger id="module-select">
                    <SelectValue placeholder="Seleccione un módulo para empezar" />
                </SelectTrigger>
                <SelectContent>
                    {modules.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id}>
                        {mod.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {selectedModule && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as GenerationType)} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Resumen</TabsTrigger>
                  <TabsTrigger value="mind-map">Mapa Mental</TabsTrigger>
                  <TabsTrigger value="process-flow">Flujo de Proceso</TabsTrigger>
                </TabsList>
              
                <div className="flex-1 mt-6">
                  {activeTab === 'process-flow' && (
                    <div className="mb-4">
                      <label htmlFor="functionality-select" className="text-sm font-medium mb-2 block">Seleccione una Funcionalidad</label>
                      <Select onValueChange={handleFunctionalityChange} value={selectedFunctionality?.name}>
                        <SelectTrigger id="functionality-select">
                          <SelectValue placeholder="Seleccione una funcionalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedModule.functionalities.map((func) => (
                            <SelectItem key={func.id} value={func.name}>
                              {func.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeTab === 'summary' && 'Genera un texto conciso que sintetice la información clave del módulo.'}
                    {activeTab === 'mind-map' && 'Genera un mapa mental que represente la estructura conceptual del módulo.'}
                    {activeTab === 'process-flow' && 'Genera un diagrama de flujo para la funcionalidad seleccionada.'}
                  </p>
                </div>

                <div className="mt-auto">
                    <Button onClick={handleGenerate} disabled={isGenerateDisabled} className="w-full">
                        {isLoading ? <LoadingSpinner /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {getButtonText()}
                    </Button>
                </div>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Resultado Generado</CardTitle>
          <CardDescription>Aquí se visualizará el contenido generado por la IA.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 flex items-center justify-center p-6">
            {isLoading && (
              <div className='text-center space-y-2'>
                  <LoadingSpinner size={32}/>
                  <p className='text-muted-foreground'>Generando...</p>
              </div>
            )}
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            {!isLoading && !error && result && resultType && (
                 <>
                    {resultType === 'summary' && (
                       <div className="prose prose-sm max-w-none rounded-md bg-muted/50 p-4 text-foreground w-full h-full overflow-y-auto">
                           <p>{result}</p>
                       </div>
                    )}
                    {resultType === 'mind-map' && (
                        <div className="rounded-md bg-muted/50 p-4 w-full h-full overflow-auto">
                            <pre className="text-sm whitespace-pre-wrap font-code">{result}</pre>
                        </div>
                    )}
                    {resultType === 'process-flow' && (
                        <div className="relative aspect-video w-full">
                             <Image
                                src={result}
                                alt={`Diagrama de flujo generado`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                 </>
            )}
            {!isLoading && !error && !result && (
                <div className="text-center text-muted-foreground">
                    <p>Seleccione un módulo y genere contenido para verlo aquí.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
