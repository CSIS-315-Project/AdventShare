import "server-only";
import { supabase } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Claim } from "@/types/claim";

export async function getClaims({
  postId,
  query = "",
  limit = 10,
  offset = 0,
}: {
  postId: string;
  query?: string;
  limit?: number;
  offset?: number;
}) {
  let queryBuilder = supabase
    .from("claims")
    .select(
      `
    *,
    items (*)
    `
    )
    .eq("item_id", postId)
    .order("item_id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (query) {
    // Use clerk to search for the user's email, first name, last name, or first name + last name
    const auth = await clerkClient();
    const users = await auth.users.getUserList({ limit: 10, query });

    if (users.totalCount === 0) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const userIds = users.data.map((user) => user.id);

    queryBuilder = queryBuilder.or(
      userIds.map((id) => `user_id.eq.${id}`).join(",")
    );
  }

  const { data: claims, error } = await queryBuilder;

  if (error || claims.length === 0) {
    return {
      data: [],
      totalCount: 0,
    };
  }

  if (error) {
    console.error("Error fetching claims:", error);
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
      reason: claim.reason,
      item: claim.items,
    };
  });

  const auth = await clerkClient();

  const data = await Promise.all(
    processedClaims.map(async (claim) => {
      let user;
      let itemAuthor;
      const foundUser = await auth.users
        .getUser(claim.user_id)
        .catch(() => null);
      user = foundUser
        ? {
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
          }
        : {
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

      const foundItemAuthor = claim.items
        ? await auth.users.getUser(claim.items.user_id).catch(() => null)
        : null;
      itemAuthor = foundItemAuthor
        ? {
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
          }
        : {
            firstName: null,
            lastName: null,
            imageUrl: null,
            id: claim.items?.user_id || "",
            emailAddresses: [
              {
                id: claim.items?.user_id || "",
                emailAddress: claim.items?.user_id || "",
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
    data: Claim[];
    totalCount: number;
  };
}
