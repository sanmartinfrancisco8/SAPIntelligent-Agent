
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/loading-spinner';
import Image from 'next/image';
import { Download, Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppLogo } from '@/components/icons';

type GenerationType = 'summary' | 'mind-map' | 'process-flow';

type ResultPayload = {
  type: GenerationType;
  data: string;   // texto o url de imagen
  title: string;
};

export default function FullScreenResultPage() {
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPayload = sessionStorage.getItem('resultPayload');
      if (storedPayload) {
        setPayload(JSON.parse(storedPayload));
      }
    } catch (error) {
      console.error("Failed to parse result payload from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCopy = () => {
    if (!payload?.data) return;
    if (payload.type === 'summary' || payload.type === 'mind-map') {
      navigator.clipboard.writeText(payload.data);
      toast({ title: 'Copiado', description: 'El contenido se ha copiado al portapapeles.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'No se puede copiar una imagen directamente.' });
    }
  };

  const handleDownload = () => {
    if (!payload?.data) return;

    const fileSafeTitle = payload.title.replace(/ /g, '_');

    if (payload.type === 'summary' || payload.type === 'mind-map') {
      const blob = new Blob([payload.data], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileSafeTitle}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const a = document.createElement('a');
      a.href = payload.data;
      a.download = `${fileSafeTitle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClose = () => {
    window.close();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center text-foreground p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">No se encontraron resultados</h1>
        <p className="text-muted-foreground mb-6">Cierra esta pestaña y genera un nuevo resultado desde el Asistente de Estudio.</p>
        <Button onClick={handleClose}>
          <X className="mr-2 h-4 w-4" />
          Cerrar
        </Button>
      </div>
    );
  }

  const canCopy = payload.type === 'summary' || payload.type === 'mind-map';

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/70 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-3">
          <AppLogo className="h-8 w-8" />
          <h1 className="font-headline text-xl font-bold text-primary truncate">{payload.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!canCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </Button>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="w-full h-full flex items-center justify-center">
          {payload.type === 'summary' && (
            <div className="prose prose-invert max-w-4xl rounded-md bg-card p-6 w-full h-full overflow-y-auto">
              <p>{payload.data}</p>
            </div>
          )}

          {payload.type === 'mind-map' && (
            <div className="rounded-md bg-card p-6 w-full h-full overflow-auto max-w-4xl">
              <pre className="text-sm whitespace-pre-wrap font-code">{payload.data}</pre>
            </div>
          )}

          {payload.type === 'process-flow' && (
            <div className="relative w-full h-full">
              <Image
                src={payload.data}
                alt={`Diagrama para ${payload.title}`}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
