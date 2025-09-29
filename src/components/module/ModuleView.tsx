

"use client";

import type { Module } from '@/lib/sap-modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
          <CardTitle className="font-headline">Funcionalidades del Módulo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {module.functionalities.map((func) => (
                <div key={func.id}>
                    <h3 className="font-semibold">{func.name}</h3>
                    <p className="text-muted-foreground text-sm">{func.description}</p>
                </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 ml-auto no-print">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir en PDF
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://help.sap.com/docs/SAP_BUSINESS_ONE" target="_blank">
              <Book className="mr-2 h-4 w-4" />
              Consulta Manual
            </Link>
          </Button>
        </div>
    </div>
  );
}
