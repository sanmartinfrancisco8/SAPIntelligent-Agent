
"use client";

import type { Module, Functionality } from '@/lib/sap-modules';
import { modules } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { getModuleSummary, getMindMap, getProcessFlow } from '@/app/actions';
import { Button } from '../ui/button';
import { FileText, GitBranch, Workflow, Wand2, Expand, Shrink, Download, Copy } from 'lucide-react';
import { LoadingSpinner } from '../loading-spinner';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type GenerationType = 'summary' | 'mind-map' | 'process-flow';
type ResultData = string | null;

export type ViewerPayload = {
  type: GenerationType;
  data: string;
  title: string;
};

export function KnowledgeProcessingToolkit() {
  const [selectedModule, setSelectedModule] = useState<Module | undefined>(undefined);
  const [selectedFunctionality, setSelectedFunctionality] = useState<Functionality | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData>(null);
  const [resultType, setResultType] = useState<GenerationType | null>(null);
  const [activeTab, setActiveTab] = useState<GenerationType>('summary');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();

  const handleModuleChange = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    setSelectedModule(mod);
    setSelectedFunctionality(mod?.functionalities[0]);
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

    // === MOCK DATA IMPLEMENTATION ===
    setTimeout(() => {
      let data: ResultData = null;
      switch (activeTab) {
        case 'summary':
          data = `Este es un resumen de ejemplo para el módulo "${selectedModule.name}". Este módulo es fundamental para gestionar ${selectedModule.description.toLowerCase()}. Se integra con otros módulos para garantizar un flujo de datos coherente y una visión completa del negocio.`;
          break;
        case 'mind-map':
          data = `
[${selectedModule.name}]
└─── Funcionalidades Clave
${selectedModule.functionalities.map(f => `    ├── ${f.name}`).join('\n')}
└─── Descripción
    └─── ${selectedModule.description}
└─── Integraciones
    ├── Finanzas
    └─── CRM
          `;
          break;
        case 'process-flow':
          // If a functionality is selected, its ID is used for the image seed.
          // Otherwise, the module\'s ID is used for a general process flow diagram.
          const seedId = selectedFunctionality ? selectedFunctionality.id : selectedModule.id;
          data = `https://picsum.photos/seed/${seedId}/1200/800`;
          break;
        default:
          setError('Tipo de generación no reconocido.');
          setIsLoading(false);
          return;
      }
      setResult(data);
      setIsLoading(false);
    }, 1500); // Simulate a 1.5 second delay
  };

  const handleCopy = () => {
    if (result && (resultType === 'summary' || resultType === 'mind-map')) {
      navigator.clipboard.writeText(result);
      toast({ title: 'Copiado', description: 'El contenido se ha copiado al portapapeles.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'No se puede copiar una imagen directamente.' });
    }
  };

  const handleDownload = () => {
    if (!result || !resultType || !selectedModule) return;

    const title =
      resultType === 'process-flow'
        ? selectedFunctionality
          ? `Flujo_de_Proceso_${selectedFunctionality.name.replace(/[\\/:\s]/g, '_')}`
          : `Flujo_General_${selectedModule.name.replace(/[\\/:\s]/g, '_')}`
        : `Resultado_${selectedModule.name.replace(/[\\/:\s]/g, '_')}`;

    if (resultType === 'summary' || resultType === 'mind-map') {
        const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        const a = document.createElement('a');
        a.href = result;
        a.download = `${title}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  };

  const openInNewTab = () => {
    if (!result || !resultType || !selectedModule) return;

    const title =
      resultType === 'process-flow'
        ? selectedFunctionality
          ? `Flujo de Proceso – ${selectedFunctionality.name}`
          : `Flujo de Proceso General – ${selectedModule.name}`
        : `Resultado IA – ${selectedModule.name}`;

    const payload: ViewerPayload = {
      type: resultType,
      data: result,
      title: title,
    };

    try {
      const key = `viewerPayload_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(payload));
      const url = `/dashboard/knowledge-toolkit/viewer?key=${key}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error("Failed to open new tab or set localStorage item:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo abrir la nueva pestaña. Por favor, revisa los permisos de tu navegador.",
      });
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'summary': return 'Generar Resumen';
      case 'mind-map': return 'Generar Mapa Mental';
      case 'process-flow': return 'Generar Diagrama';
      default: return 'Generar';
    }
  };

  const isGenerateDisabled = isLoading || !selectedModule;

  const ResultIcon = () => {
    if (!resultType) return null;
    switch (resultType) {
      case 'summary': return <FileText className="h-6 w-6 text-primary" />;
      case 'mind-map': return <GitBranch className="h-6 w-6 text-primary" />;
      case 'process-flow': return <Workflow className="h-6 w-6 text-primary" />;
      default: return null;
    }
  };

  const canCopy = resultType === 'summary' || resultType === 'mind-map';

  const resultsPanel = (
    <Card className={cn(
        "lg:col-span-3 flex flex-col bg-card/70 backdrop-blur-sm shadow-xl",
        isFullScreen && "fixed inset-0 z-50 rounded-none border-none h-screen w-screen"
    )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          {resultType && !isLoading && <ResultIcon />}
          <div>
            <CardTitle className="font-headline text-primary">Panel de Resultados Inteligentes</CardTitle>
            <CardDescription>Aquí se visualizará el contenido generado por el Asistente de Estudio.</CardDescription>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {result && !isLoading && (
             <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={openInNewTab}
                    title="Ver en otra pestaña"
                >
                    <Expand className="mr-2 h-4 w-4" /> Ver en otra pestaña
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    aria-label={isFullScreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                    title={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
                    >
                    {isFullScreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </Button>
             </>
          )}
          {isFullScreen && result && !isLoading && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />Descargar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!canCopy}>
                <Copy className="mr-2 h-4 w-4" />Copiar
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {isLoading && (
            <div className='text-center space-y-4 animate-fade-in'>
                <LoadingSpinner size={40}/>
                <p className='text-lg text-muted-foreground'>Generando contenido con IA...</p>
            </div>
          )}
          {error && <p className="text-sm text-destructive text-center animate-fade-in">{error}</p>}
          {!isLoading && !error && result && resultType && (
               <div className={cn('w-full h-full animate-fade-in', isFullScreen && "p-8")}>
                  {resultType === 'summary' && (
                     <div className="prose prose-invert max-w-none rounded-md bg-muted/50 p-6 text-foreground w-full h-full overflow-y-auto">
                         <p>{result}</p>
                     </div>
                  )}
                  {resultType === 'mind-map' && (
                      <div className="rounded-md bg-muted/50 p-6 w-full h-full overflow-auto">
                          <pre className="text-sm whitespace-pre-wrap font-code">{result}</pre>
                      </div>
                  )}
                  {resultType === 'process-flow' && (
                      <div className="relative w-full h-full">
                           <Image
                              src={result}
                              alt={`Diagrama de flujo generado`}
                              fill
                              className="object-contain"
                           />
                      </div>
                  )}
               </div>
          )}
          {!isLoading && !error && !result && (
              <div className="text-center text-muted-foreground animate-fade-in">
                  <p>Seleccione una herramienta y genere contenido para visualizarlo aquí.</p>
              </div>
          )}
      </CardContent>
    </Card>
  );

  if (isFullScreen) {
    return resultsPanel;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      <Card className="lg:col-span-2 flex flex-col bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Asistente de Estudio</CardTitle>
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

      {resultsPanel}
    </div>
  );
}
