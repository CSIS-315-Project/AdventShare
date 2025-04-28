import "server-only";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { CategorySchema, SubcategorySchema } from "@/types/categories";
import { z } from "zod";

export async function getCategories(): Promise<z.infer<typeof CategorySchema>[]> {
  const supabase = await createClerkSupabaseClientSsr();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: false });

  if (error) throw new Error(error.message);
  if (!categories) return [];

  // parse into an array of your Zod schema
  const result = CategorySchema.array().safeParse(categories);
  if (!result.success) {
    console.error("Invalid category data:", result.error.format());
    throw new Error("Fetched categories did not match the expected schema");
  }

  return result.data;
}

export async function getSubcategories(
  categoryId: string
): Promise<z.infer<typeof SubcategorySchema>[]> {
  const supabase = await createClerkSupabaseClientSsr();

  const { data: subcategories, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("name", { ascending: false });

  if (error) throw new Error(error.message);
  if (!subcategories) return [];

  const result = SubcategorySchema.array().safeParse(subcategories);
  if (!result.success) {
    console.error("Invalid subcategory data:", result.error.format());
    throw new Error("Fetched subcategories did not match the expected schema");
  }

  return result.data;
}
