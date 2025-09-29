import { Button } from "@/components/ui/button";
import { KnowledgeProcessingToolkit } from "@/components/module/KnowledgeProcessingToolkit";
import { BookOpenCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { AIChatContent } from "@/components/chat/AIChat";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
       <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">Bienvenido a SAP B1 Companion</h1>
          <p className="text-lg text-muted-foreground">Su asistente inteligente para explorar las profundidades de SAP Business One.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild>
                <Link href="/dashboard/knowledge-toolkit" target="_blank">
                    <BookOpenCheck className="mr-2" />
                    Área de Estudio
                </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <MessageSquare className="mr-2" />
                  Asistente IA
                </Button>
              </SheetTrigger>
              <AIChatContent />
            </Sheet>
        </div>
      </header>

      <p className="text-muted-foreground max-w-4xl">
          Para comenzar, puede seleccionar un módulo del menú de navegación a la izquierda para ver su descripción y funcionalidades, o utilizar nuestra Área de Estudio para generar resúmenes, mapas mentales y flujos de proceso basados en IA.
      </p>

    </div>
  );
}
