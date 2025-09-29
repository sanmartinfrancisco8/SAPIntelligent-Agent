
"use client";

import type { Module, Functionality } from '@/lib/sap-modules';
import { modules } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleSummary } from './ModuleSummary';
import { MindMap } from './MindMap';
import { ProcessFlow } from './ProcessFlow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function KnowledgeProcessingToolkit() {
  const [selectedModule, setSelectedModule] = useState<Module | undefined>(undefined);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<Functionality[]>([]);

  const handleModuleChange = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    setSelectedModule(mod);
    setSelectedFunctionalities(mod?.functionalities || []);
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Área de Estudio (Knowledge Processing Toolkit)</CardTitle>
          <CardDescription>Esta área, alimentada por el contexto de la consulta actual (módulo/funcionalidad) y la base de conocimiento, debe ofrecer las siguientes salidas dinámicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label htmlFor="module-select" className="text-sm font-medium mb-2 block">Seleccione un Módulo</label>
            <Select onValueChange={handleModuleChange}>
                <SelectTrigger id="module-select" className="w-full sm:w-[300px]">
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
            <Tabs defaultValue="summary">
              <div className="flex flex-wrap gap-4 mb-4">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-auto md:inline-flex">
                  <TabsTrigger value="summary">Resumen IA</TabsTrigger>
                  <TabsTrigger value="mind-map">Mapa Mental IA</TabsTrigger>
                  <TabsTrigger value="process-flow">Flujo de Proceso IA</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="summary">
                  <Card className='shadow-none border-0'>
                      <CardHeader>
                          <CardTitle>Resumen de la Consulta</CardTitle>
                          <CardDescription>
                              Generación de un texto conciso que sintetice la información clave del módulo y la funcionalidad actual.
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <ModuleSummary module={selectedModule} />
                      </CardContent>
                  </Card>
              </TabsContent>
              <TabsContent value="mind-map">
                  <Card className='shadow-none border-0'>
                      <CardHeader>
                          <CardTitle>Mapa Mental (Mind Map)</CardTitle>
                          <CardDescription>
                              Generación visual de un mapa mental que represente la estructura jerárquica y conceptual del módulo y su relación con la funcionalidad consultada.
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <MindMap moduleName={selectedModule.name} />
                      </CardContent>
                  </Card>
              </TabsContent>
              <TabsContent value="process-flow">
                  <Card className='shadow-none border-0'>
                      <CardHeader>
                          <CardTitle>Diagrama de Flujo (Flow Diagram)</CardTitle>
                          <CardDescription>
                              Generación visual de un diagrama de flujo de proceso para la funcionalidad consultada. Debe ilustrar la trazabilidad de documentos (Ej., Oferta de Ventas &rarr; Orden de Ventas &rarr; Entrega &rarr; Factura).
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <ProcessFlow functionalities={selectedFunctionalities} />
                      </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
  );
}
