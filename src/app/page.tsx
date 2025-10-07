"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

const ADMIN_EMAIL = "sanmartinfrancisco8@gmail.com";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // If user is admin, redirect to admin page, otherwise to dashboard
        if (user.email === ADMIN_EMAIL) {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard");
        }
      } else {
        router.replace("/login");
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size={48} />
    </div>
  );
}
