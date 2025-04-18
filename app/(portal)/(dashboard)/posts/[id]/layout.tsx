import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PostSidebar } from "@/features/posts/components/sidebar/Sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const postId = (await params).id;

  return (
    <>
      <PostSidebar postId={postId} />
      <div className="w-full px-3">
        <div className="py-4 flex flex-row">
          <SidebarTrigger />
        </div>
        <Separator />
        <div className="py-4">{children}</div>
      </div>
    </>
  );
}
