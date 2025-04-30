import "server-only";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { CategorySchema } from "../../types";

const supabase = await createClerkSupabaseClientSsr();

export async function getCategories() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  if (!categories) {
    throw new Error("No categories found");
  }

  return categories.map((category) => CategorySchema.parse(category));
}
