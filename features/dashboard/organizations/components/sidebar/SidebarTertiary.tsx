import * as React from "react"
import { Home, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function SidebarTertiary({
  id,
  admin,
  ...props
}: {
  id?: string;
  admin?: boolean;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>): React.JSX.Element {
  if (!admin) {
    return <></>
  }
  
  const items = [{
    title: "Settings",
    url: `/organizations/${id}/settings`,
    icon: Home
  }] as {
    title: string
    url: string
    icon: LucideIcon
  }[]

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url} aria-disabled={!id}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
