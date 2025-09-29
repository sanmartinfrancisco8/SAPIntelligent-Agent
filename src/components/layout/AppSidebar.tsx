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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function AppSidebar() {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<string[]>(modules.filter(m => pathname.startsWith(`/dashboard/module/${m.id}`)).map(m => m.id));

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <>
      <SidebarHeader className="p-4 no-print">
        <div className="flex items-center gap-3">
          <AppLogo />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">SAP Intelligent Agent</h2>
            <p className="text-xs text-sidebar-foreground/80">v1.0</p>
          </div>
        </div>
      </SidebarHeader>
      <Separator className="no-print bg-sidebar-border"/>
      <SidebarContent className="p-2 no-print">
        <SidebarMenu>
          {modules.map((module) => (
            <Collapsible key={module.id} asChild open={openModules.includes(module.id)} onOpenChange={() => toggleModule(module.id)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(`/dashboard/module/${module.id}`)}
                      tooltip={{ children: module.name }}
                      className="justify-between"
                    >
                        <div className='flex items-center gap-2'>
                            <module.icon />
                            <span>{module.name}</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 transition-transform", openModules.includes(module.id) && "rotate-90")} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {module.functionalities.map(func => (
                        <SidebarMenuSubItem key={func.id}>
                            <Link href={`/dashboard/module/${module.id}#${func.id}`} passHref>
                                <SidebarMenuSubButton asChild isActive={false}>
                                    <a>{func.name}</a>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden md:flex p-4 no-print">
         <SidebarTrigger />
      </SidebarFooter>
    </>
  );
}
