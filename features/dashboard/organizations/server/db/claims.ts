import "server-only";
import { supabase } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";

/*

Claims have these fields in supabase:
id: uuid
item_id: uuid FK
user_id: uuid FK
created_at: timestamptz
updated_at: timestamptz
status: 'pending' | 'approved' | 'rejected'
organization_id: text (clerk org id)

Items have these fields in supabase:
id: uuid
name: varchar
description: text
quantity: number
updated_at: timestamptz
created_at: timestamptz
user_id: uuid FK
category_id: uuid FK
is_public: boolean
organization_id: text (clerk org id)

*/

export async function getOrganizationClaims({
  organizationId,
  query = "",
  limit = 10,
  offset = 0,
}: {
  organizationId: string;
  query?: string;
  limit?: number;
  offset?: number;
}) {
  const { data: claims, error } = await supabase
    .from("claims")
    .select(`
      *,
      items:item_id (
        id,
        name,
        description,
        quantity,
        updated_at,
        created_at,
        user_id,
        category_id,
        is_public,
        organization_id
      )
    `)
    // .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return {
      data: [],
      totalCount: 0,
    };
  }

  const processedClaims = claims.map((claim) => {
    if (!claim.items) {
      return claim;
    }

    return {
      ...claim,
      title: claim.items.name,
      description: claim.items.description,
      item: claim.items
    };
  });

  const auth = await clerkClient();

  const data = await Promise.all(
    processedClaims.map(async (claim) => {
      let user;
      let itemAuthor;
      const foundUser = await auth.users.getUser(claim.user_id).catch(() => null);
      user = foundUser ? {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        imageUrl: foundUser.imageUrl,
        emailAddresses: foundUser.emailAddresses.map((email) => {
          return {
            id: email.id,
            emailAddress: email.emailAddress,
          };
        }),
      } : {
        firstName: null,
        lastName: null,
        imageUrl: null,
        id: claim.user_id,
        emailAddresses: [
          {
            id: claim.user_id,
            emailAddress: claim.user_id,
          },
        ],
      };

      const foundItemAuthor = claim.items ? await auth.users.getUser(claim.items.user_id).catch(() => null) : null;
      itemAuthor = foundItemAuthor ? {
        id: foundItemAuthor.id,
        firstName: foundItemAuthor.firstName,
        lastName: foundItemAuthor.lastName,
        imageUrl: foundItemAuthor.imageUrl,
        emailAddresses: foundItemAuthor.emailAddresses.map((email) => {
          return {
            id: email.id,
            emailAddress: email.emailAddress,
          };
        }),
      } : {
        firstName: null,
        lastName: null,
        imageUrl: null,
        id: claim.items?.user_id || '',
        emailAddresses: [
          {
            id: claim.items?.user_id || '',
            emailAddress: claim.items?.user_id || '',
          },
        ],
      };
      return {
        ...claim,
        user,
        itemAuthor,
      };
    })
  );

  return {
    data,
    totalCount: processedClaims.length || 0,
  } as {
    data: {
      id: string;
      item_id: string;
      title: string;
      description: string | null;
      created_at: string;
      user_id: string;
      organization_id: string;
      status: string;
      updated_at: Date;
      item: {
        id: string;
        name: string;
        description: string | null;
        quantity: number;
        updated_at: string;
        created_at: string;
        user_id: string;
        category_id: string;
        is_public: boolean;
        organization_id: string;
      };
      user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        imageUrl: string;
        emailAddresses: {
          id: string;
          emailAddress: string;
        }[];
      };
      itemAuthor: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        imageUrl: string;
        emailAddresses: {
          id: string;
          emailAddress: string;
        }[];
      };
    }[];
    totalCount: number;
  };
}