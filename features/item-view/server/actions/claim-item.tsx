"use server";

import { z } from "zod";
import { ClaimResponseSchema, type ClaimResponse } from "@/types/item";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";

// Input validation schema
const ClaimItemInputSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

const claimSchema = z.object({
  item_id: z.string(),
  user_id: z.string(),
  organization_id: z.string().optional(),
  status: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
});

/**
 * Server action to claim an item
 */
export async function claimItem(
  itemId: string,
  userId: string,
  quantity: number = 1,
  organizationId?: string
): Promise<ClaimResponse> {
  try {
    // Validate input
    const validatedInput = ClaimItemInputSchema.parse({ itemId });
    if (!validatedInput.itemId) {
      throw new Error("Item ID is required");
    }

    // Create claim data based on schema
    const claimData = claimSchema.parse({
      item_id: itemId,
      user_id: userId,
      organization_id: organizationId,
      status: "pending",
      quantity: quantity,
    });

    console.log("Claim data:", claimData);

    // Initialize Supabase client
    const supabase = await createClerkSupabaseClientSsr();

    // Insert claim into database
    const { data, error } = await supabase
      .from("claims")
      .insert(claimData)
      .select()
      .single();

    if (error) {
      console.error("Error inserting claim:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Return success response
    return ClaimResponseSchema.parse({
      success: true,
      message: "Claim request submitted successfully",
      data,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Handle other errors
    console.error("Error claiming item:", error);
    return {
      success: false,
      message: "Failed to submit claim request. Please try again later.",
    };
  }
}
