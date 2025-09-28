"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { modules } from "@/lib/sap-modules";
import { AppLogo } from "@/components/icons";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <AppLogo />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold">SAP B1 Companion</h2>
            <p className="text-xs text-muted-foreground">v1.0</p>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {modules.map((module) => (
            <SidebarMenuItem key={module.id}>
              <Link href={`/dashboard/module/${module.id}`} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(`/dashboard/module/${module.id}`)}
                  tooltip={{ children: module.name }}
                  className="justify-start"
                >
                  <a>
                    <module.icon />
                    <span>{module.name}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden md:flex p-4">
         <SidebarTrigger />
      </SidebarFooter>
    </>
  );
}
