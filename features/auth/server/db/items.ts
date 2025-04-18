import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { Item, ItemSchema } from "@/types/item";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Create a Supabase client instance for server-side operations
const supabase = await createClerkSupabaseClientSsr();

export async function getClaims(searchQuery: string | null) {
  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return [];
  }

  let query = supabase.from("claims").select("*").eq("user_id", userId);
  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching claims:", error.message);
    return [];
  }

  return data || [];
}

// Fetch Latest Items
export async function getItems(searchQuery: string | null) {
  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return [];
  }

  let query = supabase.from("items").select("*").eq("user_id", userId);

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error.message);
    return [];
  }

  return data || [];
}

export async function getItem(itemId: string): Promise<Item | null> {
  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return null;
  }

  // Create a Supabase client instance for server-side operations
  const supabase = await createClerkSupabaseClientSsr();

  // Query the database for the specific item
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("Error fetching item:", error);
    throw new Error(`Failed to fetch item: ${error.message}`);
  }

  if (!item) {
    throw new Error(`Item with ID ${itemId} not found`);
  }

  const authClient = await clerkClient();

  // Fetch user details
  let userName;
  let organizationName;

  const foundUser = await authClient.users.getUser(item.user_id).catch(() => null);
  if (foundUser) {
    userName = `${foundUser.firstName || ""} ${
      foundUser.lastName || ""
    }`.trim();
  }

  // Fetch organization details
  if (item.organization_id) {
    try {
      const foundOrganization = await authClient.organizations.getOrganization({
        organizationId: item.organization_id,
      });
      if (foundOrganization) {
        organizationName = foundOrganization.name;
      }
    } catch (err) {
      console.warn(`Failed to get organization for item ${item.id}:`, err);
    }
  }

  // Fetch category and subcategory names
  let categoryName = "Uncategorized";
  let subcategoryName = "";

  if (item.subcategory_id) {
    // First fetch the subcategory
    const { data: subcategoryData } = await supabase
      .from("subcategories")
      .select("name, category_id")
      .eq("id", item.subcategory_id)
      .single();

    if (subcategoryData) {
      subcategoryName = subcategoryData.name;

      // Then fetch the category using the category_id from the subcategory
      if (subcategoryData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("name")
          .eq("id", subcategoryData.category_id)
          .single();

        if (categoryData) {
          categoryName = categoryData.name;
        }
      }
    }
  }

  // Fetch all images from item's folder in private bucket
  let images: string[] = [];

  const { data: imageFiles, error: listError } = await supabase.storage
    .from("item-images")
    .list(`${item.id}`, {
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    console.error(`Error listing images for item ${item.id}:`, listError);
  } else if (imageFiles && imageFiles.length > 0) {
    // Create signed URLs for all images
    const signedUrlPromises = imageFiles.map(async (file) => {
      const { data, error } = await supabase.storage
        .from("item-images")
        .createSignedUrl(`${item.id}/${file.name}`, 60 * 60); // 1 hour expiration

      if (error) {
        console.error(`Error creating signed URL for ${file.name}:`, error);
        return null;
      }
      return data.signedUrl;
    });

    // Wait for all signed URLs to be created
    const signedUrls = await Promise.all(signedUrlPromises);
    images = signedUrls.filter((url) => url !== null);
  }

  // Transform the database item into our schema format
  const formattedItem = {
    ...item,
    name: item.title || item.name,
    description: item.description || "",
    postedDate: item.created_at,
    status: item.status || "Available",
    category: categoryName,
    subcategory: subcategoryName,
    images: images || [],
    school: {
      name: organizationName || "Unknown Organization",
      location: item.location || "",
      contactEmail: item.contact_email || "no-reply@example.com",
    },
    user_name: userName || item.user_id,
    condition: undefined,
  };

  console.log(formattedItem);

  // Validate the data with Zod schema
  return ItemSchema.parse(formattedItem);
}