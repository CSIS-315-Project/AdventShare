"use server"

import { z } from "zod"
import type { CreateItemResult } from "../../types"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client"
import { authClient } from "@/lib/safe-actions"

const supabase = await createClerkSupabaseClientSsr()

export const createItem = authClient
  .schema(z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    subcategory_id: z.string().min(1),
    condition: z.string().min(1),
    quantity: z.number().int().positive(),
    value: z.number().nonnegative().optional(),
    is_public: z.boolean(),
    organization_id: z.string().optional()
  }))
  .action(async ({ parsedInput, ctx }): Promise<CreateItemResult> => {
    try {
      const { userId } = ctx;
      
      if (!userId) {
        return { 
          success: false, 
          message: "Authentication required"
        };
      }

      const { 
        name, 
        description, 
        quantity, 
        subcategory_id, 
        is_public, 
        condition, 
        value, 
        organization_id 
      } = parsedInput;

      // Insert the new item into the database
      const { data, error } = await supabase
        .from("items")
        .insert({
          name,
          description,
          quantity,
          subcategory_id,
          user_id: userId,
          organization_id,
          is_public,
          condition,
          value,
          status: "Available",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating item:", error);
        return { 
          success: false, 
          message: "Failed to create item"
        };
      }

      return { 
        success: true, 
        message: "Item created successfully", 
        itemId: data.id 
      };

    } catch (error) {
      console.error("Unexpected error creating item:", error);
      return { 
        success: false, 
        message: "An unexpected error occurred"
      };
    }
  });
