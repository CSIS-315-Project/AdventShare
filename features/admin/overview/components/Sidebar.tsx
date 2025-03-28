import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

import { SidebarMain } from "@/features/admin/overview/components/SidebarMain";
import { SidebarSecondary } from "@/features/admin/overview/components/SidebarSecondary";
import { SidebarTertiary } from "@/features/admin/overview/components/SidebarTertiary";
import { SidebarUser } from "@/features/admin/overview/components/SidebarUser";

export async function AdminSidebar() {
  const user = await currentUser();

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/Logo.png" alt="Logo" height={50} width={50} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AdventShare</span>
                  <span className="truncate text-xs">Administrator</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain />
        {/* <SidebarSecondary /> */}
        {/* <SidebarTertiary className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={{
          firstName: user.firstName || "Unknown",
          imageUrl: user.imageUrl,
          primaryEmailAddress: user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : "Unknown",
          emailAddresses: user.emailAddresses ? [user.emailAddresses[0].emailAddress] : ["Unknown"],
        }} />
      </SidebarFooter>
    </Sidebar>
  );
}
