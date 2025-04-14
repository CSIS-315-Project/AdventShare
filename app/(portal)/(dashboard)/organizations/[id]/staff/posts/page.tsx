import { getOrganizationPosts } from "@/features/dashboard/organizations/server/db/posts";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsTable } from "@/features/dashboard/organizations/components/table/posts/content";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PostsTableSkeleton from "@/features/dashboard/organizations/components/table/posts/skeleton";
import { getSubcategories } from "@/lib/supabase/db";

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const query = (await searchParams)?.query || "";
  const currentPage = Math.max(1, Number((await searchParams)?.page) || 1);
  const LIMIT = 10;

  const posts = await getOrganizationPosts({
    organizationId: (await params).id,
    query,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
  });

  const categories = await getSubcategories();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Posts</h1>
        <p className="text-muted-foreground">
          View and manage posts created by staff members.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl">Posts</h2>
        </div>
        <div className="mt-4 space-y-4">
          <Search placeholder="Search posts..." />
          
          <Suspense fallback={<PostsTableSkeleton />}>
            <PostsTable categories={categories} posts={posts.data} />
          </Suspense>

          <div className="mt-5 flex w-full justify-center">
            <Pagination
              page={currentPage}
              offset={(currentPage - 1) * LIMIT}
              limit={LIMIT}
              total={Math.ceil(posts.totalCount / LIMIT)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
