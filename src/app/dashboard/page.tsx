import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeProcessingToolkit } from "@/components/module/KnowledgeProcessingToolkit";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
       <header className="flex items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">Bienvenido a SAP B1 Companion</h1>
          <p className="text-lg text-muted-foreground">Su asistente inteligente para explorar las profundidades de SAP Business One.</p>
        </div>
      </header>

      <p className="text-muted-foreground max-w-4xl">
          Para comenzar, puede seleccionar un módulo del menú de navegación a la izquierda para ver su descripción y funcionalidades, o utilizar nuestro kit de herramientas de procesamiento de conocimiento a continuación para generar resúmenes, mapas mentales y flujos de proceso basados en IA.
      </p>

      <KnowledgeProcessingToolkit />
    </div>
  );
}
