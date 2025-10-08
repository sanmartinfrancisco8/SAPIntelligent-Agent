import { getModuleById } from '@/lib/sap-modules';
import { notFound } from 'next/navigation';
import { ModuleView } from '@/components/module/ModuleView';

type ModulePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
    const { modules } = await import('@/lib/sap-modules');
    return modules.map((module) => ({
      slug: module.id,
    }));
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const module = getModuleById(slug);

  if (!module) {
    notFound();
  }

  return <ModuleView module={module} />;
}
