import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/client";
import { clerkClient } from "@clerk/nextjs/server";

// Create a Supabase client instance for server-side operations
const supabase = await createClerkSupabaseClientSsr();

// Fetch Latest Items
export async function getNewestItems() {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20); // Fetch latest 4 items

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }

  const auth = await clerkClient();

  const data = await Promise.all(
    items.map(async (item) => {
      let userName;
      let organizationName;

      // Fetch user details
      const foundUser = await auth.users
        .getUser(item.user_id)
        .catch(() => null);
      if (foundUser) {
        userName = `${foundUser.firstName || ""} ${
          foundUser.lastName || ""
        }`.trim();
      }

      // Fetch organization details
      if (item.organization_id) {
        try {
          const foundOrganization = await auth.organizations.getOrganization({
            organizationId: item.organization_id,
          });
          console.log("foundOrganization", foundOrganization);
          if (foundOrganization) {
            organizationName = foundOrganization.name;
          }
        } catch (err) {
          console.warn(`Failed to get organization for item ${item.id}:`, err);
        }
      }

      // Fetch image from item's folder in private bucket
      let imageUrl = null;

      const { data: imageFiles, error: listError } = await supabase.storage
        .from("item-images")
        .list(`${item.id}`, {
          limit: 1,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) {
        console.error(`Error listing images for item ${item.id}:`, listError);
      } else if (imageFiles && imageFiles.length > 0) {
        const fileName = imageFiles[0].name;

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("item-images")
            .createSignedUrl(`${item.id}/${fileName}`, 60 * 60); // 1 hour expiration

        if (signedUrlError) {
          console.error(
            `Error creating signed URL for ${fileName}:`,
            signedUrlError
          );
        } else {
          imageUrl = signedUrlData.signedUrl;
        }
      }

      return {
        ...item,
        user_name: userName || item.user_id,
        organization_name: organizationName || "Unknown Organization",
        image_url: imageUrl,
      };
    })
  );

  return data;
}

export async function getMyItems(userId: string) {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    return [];
  }

  const itemList = items;

  // Get user and organization details for each item from Clerk
  const auth = await clerkClient();

  const data = await Promise.all(
    itemList.map(async (item) => {
      let userName;
      let organizationName;
      // Fetch user details for the item
      const foundUser = await auth.users
        .getUser(item.user_id)
        .catch(() => null);
      if (foundUser) {
        userName =
          (foundUser.firstName || "") + " " + (foundUser.lastName || ""); // Fallback to empty string if last name is not available
      }

      // Fetch organization details
      if (item.organization_id) {
        try {
          const foundOrganization = await auth.organizations.getOrganization({
            organizationId: item.organization_id,
          });
          console.log("foundOrganization", foundOrganization);
          if (foundOrganization) {
            organizationName = foundOrganization.name;
          }
        } catch (err) {
          console.warn(`Failed to get organization for item ${item.id}:`, err);
        }
      }

      // Fetch image from item's folder in private bucket
      let imageUrl = null;

      const { data: imageFiles, error: listError } = await supabase.storage
        .from("item-images")
        .list(`${item.id}`, {
          limit: 1,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) {
        console.error(`Error listing images for item ${item.id}:`, listError);
      } else if (imageFiles && imageFiles.length > 0) {
        const fileName = imageFiles[0].name;

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("item-images")
            .createSignedUrl(`${item.id}/${fileName}`, 60 * 60); // 1 hour expiration

        if (signedUrlError) {
          console.error(
            `Error creating signed URL for ${fileName}:`,
            signedUrlError
          );
        } else {
          imageUrl = signedUrlData.signedUrl;
        }
      }

      return {
        ...item,
        user_name: userName?.trim() || item.user_id, // Fallback to "Unknown User" if no name is found
        organization_name: organizationName || "Unknown Organization", // Fallback to "Unknown Organization" if no name is found
        image_url: imageUrl,
      };
    })
  );

  return data || [];
}
