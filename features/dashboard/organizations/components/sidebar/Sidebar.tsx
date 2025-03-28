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

import { SidebarMain } from "@/features/dashboard/organizations/components/sidebar/SidebarMain";
import { SidebarSecondary } from "@/features/dashboard/organizations/components/sidebar/SidebarSecondary";
import { SidebarTertiary } from "@/features/dashboard/organizations/components/sidebar/SidebarTertiary";
import { SidebarUser } from "@/features/dashboard/organizations/components/sidebar/SidebarUser";

import Link from "next/link";

export async function OrganizationsSidebar({ id }: { id?: string }) {
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
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/Logo.png" alt="Logo" height={50} width={50} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AdventShare</span>
                  <span className="truncate text-xs">Organizations</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain id={id} />
        <SidebarSecondary id={id} />
        <SidebarTertiary className="mt-auto" />
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
