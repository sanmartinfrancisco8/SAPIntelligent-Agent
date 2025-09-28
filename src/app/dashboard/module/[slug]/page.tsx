import { getModuleById } from '@/lib/sap-modules';
import { notFound } from 'next/navigation';
import { ModuleView } from '@/components/module/ModuleView';

type ModulePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
    const { modules } = await import('@/lib/sap-modules');
    return modules.map((module) => ({
      slug: module.id,
    }));
}

export default function ModulePage({ params }: ModulePageProps) {
  const module = getModuleById(params.slug);

  if (!module) {
    notFound();
  }

  return <ModuleView module={module} />;
}
