import { Separator } from "@/components/ui/separator"
import OrganizationsTableSkeleton from "@/features/dashboard/organizations/components/table/organizations/skeleton";
import { OrganizationsTable } from "@/features/dashboard/organizations/components/table/organizations/content"
import Search from "@/components/search"
import { Suspense } from "react"
import Pagination from "@/components/pagination"

import { getOrganizations } from "@/features/dashboard/organizations/server/db/organization"

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  const LIMIT = 10;

  const organizations = await getOrganizations({
    limit: LIMIT,
    query,
    offset: (currentPage - 1) * LIMIT,
  })
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
        <p className="text-muted-foreground">
          View and manage your schools.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl">Your Schools</h2>
        </div>
        <div className="mt-4 space-y-4">
          <Search placeholder="Search schools..." />
          
          <Suspense fallback={<OrganizationsTableSkeleton />}>
            <OrganizationsTable organizations={organizations.data.map((obj) => {
              return {
                id: obj.id,
                name: obj.name,
                slug: obj.slug,
                imageUrl: obj.imageUrl,
                hasImage: obj.hasImage,
                maxAllowedMembers: obj.maxAllowedMemberships,
                membersCount: obj.membersCount,
                adminDeleteEnabled: obj.adminDeleteEnabled,
                createdBy: obj.createdBy,
                createdAt: obj.createdAt.toString(),
              }
            })} />
          </Suspense>

          <div className="mt-5 flex w-full justify-center">
            <Pagination
              page={currentPage}
              offset={(currentPage - 1) * LIMIT}
              limit={LIMIT}
              total={Math.ceil(organizations.totalCount / LIMIT)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}