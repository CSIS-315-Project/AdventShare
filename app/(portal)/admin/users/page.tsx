import { UsersTable } from "@/features/admin/users/components/table/content";

import { Separator } from "@/components/ui/separator";
import { CreateUser } from "@/features/admin/users/components/forms/create";
import Search from "@/features/admin/users/components/search";

import { Suspense } from 'react';
import Pagination from "@/components/pagination";
import { getUsers } from "@/features/admin/users/server/db/users";
import Skeleton from "@/features/admin/users/components/table/skeleton";
import { getOrganizations } from "@/features/admin/organizations/server/db/organizations";

export default async function UsersPage(props: {
  searchParams?: Promise<{
    organization?: string;
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const organization = searchParams?.organization || '';
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  const LIMIT = 10;

  const users = await getUsers({
    query,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
  })

  const organizations = await getOrganizations({
    query: organization,
    limit: LIMIT,
    offset: 0,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage users in the system.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Users</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search users..." />
          <CreateUser organizations={organizations.data.map((org) => {
            return {
              id: org.id,
              name: org.name,
            }
          })} />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<Skeleton />}
        >
          <UsersTable users={users.data.map((obj) => {
            return {
              id: obj.id,
              name: obj.username,
              firstName: obj.firstName,
              lastName: obj.lastName,
              createdAt: obj.createdAt,
            }
          })} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination 
            page={currentPage} 
            offset={(currentPage - 1) * LIMIT} 
            limit={LIMIT} 
            total={Math.ceil(users.totalCount / LIMIT)}
          />
        </div>
      </div>
    </div>
  );
}
