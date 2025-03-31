import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/client";

// Create a Supabase client instance for server-side operations
const supabase = await createClerkSupabaseClientSsr();

// Fetch Latest Items
export async function getItems(searchQuery: string | null) {
  let query = supabase.from("items").select("*");

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
