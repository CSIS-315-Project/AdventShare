import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationsSidebar } from "@/features/dashboard/organizations/components/sidebar/Sidebar";

export default async function OrganizationsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SidebarProvider className="w-full">
      <OrganizationsSidebar id={id} />
      <div className="w-full px-3">
        <div className="py-4 flex flex-row justify-between">
          <SidebarTrigger />
        </div>
        <Separator />
        <div className="py-4">{children}</div>
      </div>
    </SidebarProvider>
  );
}
