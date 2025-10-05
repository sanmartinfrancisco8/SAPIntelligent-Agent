
export default function KnowledgeToolkitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-transparent">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-card/70 px-4 backdrop-blur-sm md:px-6">
        <h1 className="font-headline text-xl font-bold text-primary">Área de Estudio</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
