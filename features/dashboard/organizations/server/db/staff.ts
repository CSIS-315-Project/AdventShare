import "server-only";

interface Staff {
  object: string;
  id: string;
  public_metadata: {};
  private_metadata: {};
  role: string;
  role_name: string;
  permissions: string[];
  created_at: number;
  updated_at: number;
  organization: {};
  public_user_data: {
    first_name: string;
    last_name: string;
    image_url: string;
    has_image: boolean;
    identifier: string;
    profile_image_url: string;
    user_id: string;
  };
}

// Custom fetch to support query. [It's a little dumb that Clerk doesn't support this out of the box w/ their SDK]
export async function getOrganizationStaff({
  organizationId,
  query = "",
  limit = 10,
  offset = 0,
}: {
  organizationId: string;
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  data: Staff[];
  totalCount: number;
}> {
  const data = await fetch(
    `https://api.clerk.com/v1/organizations/${organizationId}/memberships?limit=${limit}&offset=${offset}&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );

  if (!data.ok) {
    return {
      data: [],
      totalCount: 0,
    };
  }

  const json = await data.json();

  return {
    data: json.data,
    totalCount: json.total_count,
  };
}
