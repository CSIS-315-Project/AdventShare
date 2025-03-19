import "server-only";

import auth from "@/lib/auth";

export async function getOrganizations({ limit = 10, offset = 0, query }: {
    limit?: number;
    offset?: number;
    query?: string;
}) {
    return auth.organizations.getOrganizationList({
        limit,
        offset,
        includeMembersCount: true,
        query
    });
}