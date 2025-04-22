import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/client";
import { auth } from "@clerk/nextjs/server";

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

// Fetch Latest Items
export async function getItem(itemId: string) {
  const { userId } = await auth();
  if (!userId) {
    console.error("User not authenticated");
    return [];
  }

  let query = supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .eq("id", itemId);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error.message);
    return [];
  }

  return data || [];
}
