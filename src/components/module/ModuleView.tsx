import type { Module } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleSummary } from './ModuleSummary';
import { MindMap } from './MindMap';
import { ProcessFlow } from './ProcessFlow';

interface ModuleViewProps {
  module: Module;
}

export function ModuleView({ module }: ModuleViewProps) {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
          <module.icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold">{module.name}</h1>
          <p className="text-lg text-muted-foreground">{module.description}</p>
        </div>
      </header>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="summary">Resumen IA</TabsTrigger>
          <TabsTrigger value="mind-map">Mapa Mental IA</TabsTrigger>
          <TabsTrigger value="process-flow">Flujo de Proceso IA</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Resumen del Módulo</CardTitle>
              <CardDescription>
                Un resumen conciso generado por IA sobre las principales funcionalidades de este módulo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleSummary module={module} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mind-map">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Mapa Mental Conceptual</CardTitle>
              <CardDescription>
                Visualice la estructura conceptual del módulo {module.name} con este mapa mental generado por IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MindMap moduleName={module.name} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="process-flow">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Diagrama de Flujo de Proceso</CardTitle>
              <CardDescription>
                Genere un diagrama de flujo visual para una funcionalidad específica y entienda la trazabilidad de los documentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessFlow functionalities={module.functionalities} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
