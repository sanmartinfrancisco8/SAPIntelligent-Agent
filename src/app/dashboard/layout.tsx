"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFirestore, useUser } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import {
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { doc } from "firebase/firestore";

type UserProfile = {
  approved?: boolean;
  role?: "admin" | "user" | "pending";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [firestore, user],
  );

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isUserLoading && user && !isProfileLoading) {
      if (!userProfile) {
        router.replace("/login");
        return;
      }

      if (!userProfile.approved) {
        router.replace("/pending-approval");
      }
    }
  }, [isUserLoading, user, isProfileLoading, userProfile, router]);

  // Exclude the main dashboard layout from the fullscreen knowledge toolkit pages
  if (pathname.startsWith('/dashboard/knowledge-toolkit')) {
    return <>{children}</>;
  }

  if (isUserLoading || isProfileLoading || !user || !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!userProfile.approved) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
