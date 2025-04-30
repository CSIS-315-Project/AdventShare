import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PostSidebar } from "@/features/posts/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="w-full">
      <PostSidebar postId={null} />
      <div className="w-full px-3">
        <div className="py-4 flex flex-row">
          <SidebarTrigger />
        </div>
        <Separator />
      {children}
      </div>
    </SidebarProvider>
  );
}
