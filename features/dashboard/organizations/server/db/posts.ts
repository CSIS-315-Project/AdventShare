import "server-only";
import { supabase } from "@/lib/supabase/server";
import { itemSchema } from "@/schemas/items";
import { clerkClient } from "@clerk/nextjs/server";

export async function getOrganizationPosts({
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
  const { data: posts, error } = await supabase
    .from("items")
    .select(`*`)
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return {
      data: [],
      totalCount: 0,
    };
  }

  const auth = await clerkClient();

  const data = await Promise.all(
    posts.map(async (post) => {
      let user;
      try {
        const foundUser = await auth.users.getUser(post.user_id);
        user = {
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
        };
      } catch (error) {
        user = {
          firstName: null,
          lastName: null,
          imageUrl: null,
          id: post.user_id,
          emailAddresses: [
            {
              id: post.user_id,
              emailAddress: post.user_id,
            },
          ],
        };
      }
      return {
        ...post,
        user,
      };
    })
  );

  return {
    data,
    totalCount: posts.length || 0,
  } as {
    data: {
      id: string;
      name: string;
      description: string | null;
      created_at: string;
      user_id: string;
      organization_id: string;
      quantity: number;
      subcategory_id: string;
      updated_at: Date;
      is_public: boolean;
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
    }[];
    totalCount: number;
  };
}
