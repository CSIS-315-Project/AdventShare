"use server"

import { z } from "zod"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client"
import { authClient } from "@/lib/safe-actions"
import { createItemSchema } from "@/features/item-create/schemas/items"

const supabase = await createClerkSupabaseClientSsr()

export const createItem = authClient
  .schema(createItemSchema)
  .action(
    async ({
      parsedInput: {
        name,
        description,
        subcategory,
        condition,
        quantity,
        estimatedValue,
        is_public,
      },
      ctx: { userId },
    }) => {
      try {
        // Insert the new item into the database
        const { data, error } = await supabase
          .from("items")
          .insert({
            name,
            description,
            subcategory_id: subcategory,
            is_public,
            condition,
            quantity,
            value: estimatedValue,
            user_id: userId,
            organization_id: null, // Removed orgId as it's not available in the context
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (error) {
          console.error("Error creating item:", error);
          throw new Error(`Failed to create item: ${error.message}`);
        }

        return { success: true, data };
      } catch (error) {
        console.error("Error creating item:", error);
        throw error;
      }
    }
  );