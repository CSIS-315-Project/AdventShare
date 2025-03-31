import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { getOrganizationClaims } from "@/features/dashboard/organizations/server/db/claims";
import { ClaimsTable } from "@/features/dashboard/organizations/components/table/claims/content";
import ClaimsTableSkeleton from "@/features/dashboard/organizations/components/table/claims/skeleton";

export default async function ClaimsPage({
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

  const claims = await getOrganizationClaims({
    organizationId: (await params).id,
    query,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Claims</h1>
        <p className="text-muted-foreground">
          View and manage claims created by staff members.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl">Claims</h2>
        </div>
        <div className="mt-4 space-y-4">
          <Search placeholder="Search claims..." />

          <Suspense fallback={<ClaimsTableSkeleton />}>
            <ClaimsTable claims={claims.data} />
          </Suspense>

          <div className="mt-5 flex w-full justify-center">
            <Pagination
              page={currentPage}
              offset={(currentPage - 1) * LIMIT}
              limit={LIMIT}
              total={Math.ceil(claims.totalCount / LIMIT)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
