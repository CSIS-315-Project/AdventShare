import "server-only";
import { supabase } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getAdminStats() {
  const auth = await clerkClient();

  // Get Clerk stats
  const [users, organizations] = await Promise.all([
    auth.users.getUserList(),
    auth.organizations.getOrganizationList(),
  ]);

  // Get Supabase stats
  const [
    { count: itemsCount },
    { count: claimsCount },
    { count: categoriesCount },
  ] = await Promise.all([
    supabase.from("items").select("*", { count: "exact", head: true }),
    supabase.from("claims").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  // Get recent activity
  const { data: recentClaims } = await supabase
    .from("claims")
    .select(`
      *,
      items:item_id (
        name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentItems } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    stats: {
      users: users.totalCount,
      organizations: organizations.totalCount,
      items: itemsCount || 0,
      claims: claimsCount || 0,
      categories: categoriesCount || 0,
    },
    recentActivity: {
      claims: recentClaims || [],
      items: recentItems || [],
    },
  };
} 