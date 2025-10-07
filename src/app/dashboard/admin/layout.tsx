"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminRole } from "@/hooks/use-admin-role";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    // This state should be brief before the redirect kicks in.
    return null;
  }

  return <>{children}</>;
}
