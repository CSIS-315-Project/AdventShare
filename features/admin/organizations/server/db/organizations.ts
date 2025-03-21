import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export async function getOrganizations({ limit = 10, offset = 0, query }: {
    limit?: number;
    offset?: number;
    query?: string;
}) {
    const auth = await clerkClient();

    return auth.organizations.getOrganizationList({
        limit,
        offset,
        includeMembersCount: true,
        query
    });
}