import "server-only";
import { supabase } from "./server";

// Get categories from supbase

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSubcategories() {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}