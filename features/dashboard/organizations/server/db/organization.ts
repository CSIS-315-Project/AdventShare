import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export async function getOrganization({ organizationId }: { organizationId: string }) {
  const auth = await clerkClient();

  const organization = await auth.organizations.getOrganization({ organizationId, includeMembersCount: true });

  return organization;
}

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

export async function isAdmin({ userId, orgSlug }: { userId: string; orgSlug?: string }) {
    const auth = await clerkClient();
    
    if (!orgSlug) {
        return false;
    }
    
    const organizations = await auth.users.getOrganizationMembershipList({
        userId
    })
    
    if (!organizations || !organizations.data || organizations.data.length === 0) {
        return false;
    }

    const orgMembership = organizations.data.find(membership => membership.organization.slug === orgSlug);

    return orgMembership?.role == "admin" || orgMembership?.role == "owner";
} 