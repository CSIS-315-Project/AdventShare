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

import { SidebarMain } from "@/features/posts/components/sidebar/SidebarMain";
import { SidebarSecondary } from "@/features/posts/components/sidebar/SidebarSecondary";
import { SidebarUser } from "@/features/posts/components/sidebar/SidebarUser";

export async function PostSidebar({ postId }: { postId: string }) {
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
              <a href="/posts">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/Logo.png" alt="Logo" height={50} width={50} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AdventShare</span>
                  <span className="truncate text-xs">Posts</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain postId={postId} />
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
