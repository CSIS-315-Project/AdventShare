import { Separator } from "@/components/ui/separator";
import { MembersTable } from "@/features/dashboard/organizations/components/table/staff/content";
import Search from "@/components/search";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import { InviteStaffDialog } from "@/features/dashboard/organizations/components/forms/invite-staff";
import MembersTableSkeleton from "@/features/dashboard/organizations/components/table/staff/skeleton";
import { getOrganizationStaff } from "@/features/dashboard/organizations/server/db/staff";
import { getOrganization } from "@/features/dashboard/organizations/server/db/organization";

export default async function OrganizationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const organizationId = (await params).id;
  const currentPage = Number((await searchParams)?.page) || 1;
  const query = (await searchParams)?.query || "";

  const LIMIT = 10;

  const organization = await getOrganization({
    organizationId,
  });

  const staff = await getOrganizationStaff({
    organizationId: organization.id,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
    query,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {organization.name}
        </h1>
        <p className="text-muted-foreground">
          Manage organization members and their roles.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl">Members</h2>
          <InviteStaffDialog organizationId={organization.id} />
        </div>
        <div className="mt-4 space-y-4">
          <Search placeholder="Search members..." />

          <Suspense fallback={<MembersTableSkeleton />}>
            <MembersTable
              members={staff.data.map((obj) => {
                return {
                  id: obj.id,
                  email: obj.public_user_data?.identifier,
                  firstName: obj.public_user_data?.first_name,
                  lastName: obj.public_user_data?.last_name,
                  hasImage: obj.public_user_data?.has_image,
                  imageUrl: obj.public_user_data?.image_url,
                  role: obj.role,
                  joinedAt: obj.created_at.toString(),
                };
              })}
            />
          </Suspense>

          <div className="mt-5 flex w-full justify-center">
            <Pagination
              page={currentPage}
              offset={(currentPage - 1) * LIMIT}
              limit={LIMIT}
              total={Math.ceil(staff.totalCount / LIMIT)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
