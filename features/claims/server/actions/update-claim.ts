"use server";

import { z } from "zod";
import { ClaimResponseSchema, type ClaimResponse } from "@/types/item";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { authClient } from "@/lib/safe-actions";
import { UpdateClaimInputSchema } from "../../types";
import { getUserClaims } from "../db/get-user-claims";

// Schema for updating a claim
const updateClaimSchema = UpdateClaimInputSchema;

export const updateClaim = authClient
  .schema(updateClaimSchema)
  .action(
    async ({
      parsedInput,
      ctx: { userId },
    }) => {
      try {
        const supabase = await createClerkSupabaseClientSsr();

        // Update claim in database
        const { ...updateFields } = parsedInput;
        const { error } = await supabase
          .from("claims")
          .update(updateFields)
          .eq("id", updateFields.id)
          .eq("user_id", userId);

        if (error) {
          console.error("Error updating claim:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        await getUserClaims();

        return ClaimResponseSchema.parse({
          success: true,
          message: "Claim updated successfully",
        });
      } catch (error) {
        console.error("Error updating claim:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update claim. Please try again later.",
        };
      }
    }
  );
