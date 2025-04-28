"use server";

import { z } from "zod";
// import { ClaimResponseSchema, type ClaimResponse } from "../../types";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/client";
import { authClient } from "@/lib/safe-actions";

// Initialize Supabase client
const supabase = await createClerkSupabaseClientSsr();

const claimSchema = z.object({
  item_id: z.string(),
  user_id: z.string(),
  organization_id: z.string().optional(),
  status: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
});

export const claimItem = authClient
  .schema(claimSchema)
  .action(
    async ({
      parsedInput: { item_id, organization_id, quantity },
      ctx: { userId },
    }) => {
      try {
        // Insert claim into database
        const { data, error } = await supabase
          .from("claims")
          .insert({
            item_id,
            user_id: userId,
            organization_id,
            status: "pending",
            quantity: quantity || 1,
          } as z.infer<typeof claimSchema>)
          .select()
          .single();

        if (error) {
          console.error("Error inserting claim:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        return { message: "Claim submited successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error creating claim." };
      }
    }
  );
