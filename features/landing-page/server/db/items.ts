import "server-only";

import { supabase } from "@/lib/supabase/server";
// import clerkClient from "@/lib/auth";

// Fetch Latest Items
export async function getNewestItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4); // Fetch latest 4 items

  if (error) {
    console.error("Error fetching newest items:", error);
    return [];
  }

  return data || [];
}

export async function getMyItems(userId: string) {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user items:", error);
    return [];
  }

  return data || [];
}
