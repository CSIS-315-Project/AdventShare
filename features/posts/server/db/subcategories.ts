import "server-only";

import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";

export async function getSubcategories() {
  const supabase = await createClerkSupabaseClientSsr();

  const { data: subcategories, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("name, id");

  if (error) {
    console.error("Error fetching subcategories:", error.message);
    throw new Error("Failed to fetch subcategories.");
  }
  return subcategories;
}
