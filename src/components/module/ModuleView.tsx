
"use client";

import type { Module } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleSummary } from './ModuleSummary';
import { MindMap } from './MindMap';
import { ProcessFlow } from './ProcessFlow';
import { Button } from '@/components/ui/button';
import { Printer, Book } from 'lucide-react';
import Link from 'next/link';

interface ModuleViewProps {
  module: Module;
}

export function ModuleView({ module }: ModuleViewProps) {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-8" id="main-content">
      <header className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
          <module.icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{module.name}</h1>
          <p className="text-lg text-muted-foreground">{module.description}</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Área de Estudio (Knowledge Processing Toolkit)</CardTitle>
          <CardDescription>Esta área, alimentada por el contexto de la consulta actual (módulo/funcionalidad) y la base de conocimiento, debe ofrecer las siguientes salidas dinámicas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <div className="flex flex-wrap gap-4 mb-4">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="summary">Resumen IA</TabsTrigger>
                <TabsTrigger value="mind-map">Mapa Mental IA</TabsTrigger>
                <TabsTrigger value="process-flow">Flujo de Proceso IA</TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap gap-2 ml-auto">
                <Button variant="outline" onClick={handlePrint} className="no-print">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir en PDF
                </Button>
                <Button variant="outline" asChild className="no-print">
                  <Link href="https://help.sap.com/docs/SAP_BUSINESS_ONE" target="_blank">
                    <Book className="mr-2 h-4 w-4" />
                    Consulta Manual
                  </Link>
                </Button>
              </div>
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
                        <ModuleSummary module={module} />
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
                        <MindMap moduleName={module.name} />
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
                        <ProcessFlow functionalities={module.functionalities} />
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
