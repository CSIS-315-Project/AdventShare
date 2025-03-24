import { OrganizationsTable } from "@/features/admin/organizations/components/table/content";

import { Separator } from "@/components/ui/separator";
import { CreateOrganization } from "@/features/admin/organizations/components/forms/create";
import Search from "@/features/admin/organizations/components/search";

import { Suspense } from 'react';
import Pagination from "@/components/pagination";
import { getOrganizations } from "@/features/admin/organizations/server/db/organizations";
import Skeleton from "@/features/admin/organizations/components/table/skeleton";

export default async function AdministrationPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const LIMIT = 10;

  const organizations = await getOrganizations({
    query,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
        <p className="text-muted-foreground">
          Manage school organizations in the system.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Organizations</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search orgs..." />
          <CreateOrganization />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<Skeleton />}
        >
          <OrganizationsTable organizations={organizations.data.map((obj) => {
            return {
              id: obj.id,
              name: obj.name,
              createdAt: obj.createdAt,
              phone: "123-456-7890",
              address: "1234 Main St",
            }
          })} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination page={currentPage} offset={currentPage * LIMIT} limit={LIMIT} total={organizations.totalCount} />
        </div>
      </div>
    </div>
  );
}
