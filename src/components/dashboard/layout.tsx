"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const auth = !!localStorage.getItem("sap-b1-companion-auth");
    if (auth) {
      setIsAuthenticated(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (pathname === '/dashboard/knowledge-toolkit') {
    return <>{children}</>;
  }
  
  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden bg-transparent">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
