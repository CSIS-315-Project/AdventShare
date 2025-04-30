"use server";

import { z } from "zod";
import { ClaimResponseSchema, type ClaimResponse } from "@/types/item";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { authClient } from "@/lib/safe-actions";
import { getUserClaims } from "../db/get-user-claims";

// Schema for deleting a claim
const deleteClaimSchema = z.object({
  claim_id: z.string(),
  item_name: z.string().optional(),
});

export const deleteClaim = authClient
  .schema(deleteClaimSchema)
  .action(
    async ({
      parsedInput: { claim_id },
      ctx: { userId },
    }) => {
      try {
        const supabase = await createClerkSupabaseClientSsr();

        // Delete claim from database
        const { error } = await supabase
          .from("claims")
          .delete()
          .eq("id", claim_id)
          .eq("user_id", userId);

        if (error) {
          console.error("Error deleting claim:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        return ClaimResponseSchema.parse({
          success: true,
          message: "Claim deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting claim:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete claim. Please try again later.",
        };
      }
    }
  );
