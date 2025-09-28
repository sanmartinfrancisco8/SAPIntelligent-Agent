import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Network } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="max-w-2xl w-full">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Network className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">
                    Bienvenido a SAP B1 Companion
                </CardTitle>
                <CardDescription className="text-lg">
                    Su asistente inteligente para explorar las profundidades de SAP Business One.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Para comenzar, por favor seleccione un módulo del menú de navegación a la izquierda. Podrá acceder a resúmenes generados por IA, mapas mentales interactivos y diagramas de flujo de procesos para cada funcionalidad.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
