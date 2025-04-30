import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PostSidebar } from "@/features/posts/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="w-full">
      {children}
    </SidebarProvider>
  );
}
