"use client"

import {
  Container,
  Home,
  Inbox,
  type LucideIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarSecondary({ id }: { id?: string }) {
  const projects = [{
    name: "Staff Posts",
    url: `/organizations/${id}/staff/posts`,
    icon: Container
  }, {
    name: "Staff Claims",
    url: `/organizations/${id}/staff/claims`,
    icon: Inbox
  }] as {
    name: string
    url: string
    icon: LucideIcon
  }[]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Staff</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem aria-disabled={!id} key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} aria-disabled={!id}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
