"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getOrganizations({
	query = "",
	limit = 10,
	offset = 0,
  }: {
	query?: string;
	limit?: number;
	offset?: number;
  }) {
  const client = await clerkClient();

  const organizations = await client.organizations.getOrganizationList({
    query,
	limit,
	offset
  });

  if (!organizations || organizations.totalCount === 0) {
    return [];
  }

return organizations.data.map((org) => {
	return {
		...org
	}
}) || [];
}