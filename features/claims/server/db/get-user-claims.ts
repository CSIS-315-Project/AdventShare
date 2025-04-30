"use server"

import { ClaimSchema, type Claim } from "../../types"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client"
import { clerkClient } from "@clerk/nextjs/server"

export async function getUserClaims(userID: string): Promise<Claim[]> {
  const supabase = await createClerkSupabaseClientSsr()
  const auth = await clerkClient()

  // Fetch claims for the current user
  const { data: claims, error } = await supabase
    .from("claims")
    .select("*")
    .eq("user_id", userID )
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch claims: ${error.message}`)
  if (!claims) return []

  // Fetch related items and organizations in parallel
  const itemIds = [...new Set(claims.map(c => c.item_id))]
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .in("id", itemIds)

  const itemsById = Object.fromEntries((items || []).map(i => [i.id, i]))

  // Optionally, fetch organizations if needed
  

  // Map claims to your schema
  const result: Claim[] = await Promise.all(
    claims.map(async (claim) => {
      const item = itemsById[claim.item_id]
      // Fetch organization name if needed
      let organizationName = "Unknown Organization"
      if (item?.organization_id) {
        try {
          const org = await auth.organizations.getOrganization({
            organizationId: item.organization_id,
          })
          if (org) organizationName = org.name
        } catch {}
      }

        // Fetch image from item's folder in private bucket
        let imageUrl = null;

        const { data: imageFiles, error: listError } = await supabase.storage
          .from("item-images")
          .list(`${item.id}`, {
            limit: 1,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });
  
        if (listError) {
          console.error(`Error listing images for item ${item.id}:`, listError);
        } else if (imageFiles && imageFiles.length > 0) {
          const fileName = imageFiles[0].name;
  
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("item-images")
              .createSignedUrl(`${item.id}/${fileName}`, 60 * 60); // 1 hour expiration
  
          if (signedUrlError) {
            console.error(
              `Error creating signed URL for ${fileName}:`,
              signedUrlError
            );
          } else {
            imageUrl = signedUrlData.signedUrl;
          }
        }

      // Compose the item object as needed for your schema
      const formattedItem = {
        id: item.id,
        name: item.title || item.name,
        image: imageUrl || "/Logo2.png",
        school: organizationName,
        category: item.category || "Uncategorized",
        estimatedValue: item.value || 0,
        availableQuantity: item.availableQuantity ?? item.quantity ?? 0,
      }

      // Compose the claim object
      const claimObj = {
        id: claim.id,
        item: formattedItem,
        status: claim.status,
        quantity: claim.quantity || 1,
        claimDate: claim.created_at,
        notes: claim.notes,
        responseDate: claim.response_date,
        responseMessage: claim.response_message,
      }

      // Validate with Zod
      return ClaimSchema.parse(claimObj)
    })
  )

  return result
}
