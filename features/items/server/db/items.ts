import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/client";
import { clerkClient } from "@clerk/nextjs/server";

// Create a Supabase client instance for server-side operations
const supabase = await createClerkSupabaseClientSsr();

// Fetch Latest Items
export async function getItems(searchQuery: string = "") {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("is_public", true)
    .ilike("name", `%${searchQuery}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error.message);
    return [];
  }

  return data || [];
}
