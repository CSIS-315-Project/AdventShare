"use server";

import { z } from "zod";
import { ClaimResponseSchema, type ClaimResponse } from "../../types";

// Input validation schema
const ClaimItemInputSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

/**
 * Server action to claim an item
 * In a real app, this would interact with your database
 */
export async function claimItem(itemId: string): Promise<ClaimResponse> {
  try {
    // Validate input
    const validatedInput = ClaimItemInputSchema.parse({ itemId });

    // Simulate a delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would:
    // 1. Verify the user is authenticated
    // 2. Check if the item is available
    // 3. Update the item status in the database
    // 4. Create a notification for the school
    // 5. Return the updated item

    // Validate output with Zod schema
    return ClaimResponseSchema.parse({
      success: true,
      message: "Claim request submitted successfully",
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
