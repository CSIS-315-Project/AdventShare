"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { ItemSchemaEdit } from "@/features/posts/schemas/item";
import { authClient } from "@/lib/safe-actions";

export const updateItem = authClient
  .schema(ItemSchemaEdit)
  .bindArgsSchemas<[postId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: {
        name,
        description,
        subcategory,
        condition,
        quantity,
        estimatedValue,
        images,
        isPublic,
      },
      bindArgsParsedInputs: [postId],
    }) => {
      const { data: updatedItem, error } = await supabase
        .from("items")
        .update({
          name: name,
          description: description,
          subcategory_id: subcategory,
          is_public: isPublic || false,
          condition: condition,
          quantity: quantity,
          updated_at: new Date().toISOString(),
          value: estimatedValue,
        })
        .eq("id", postId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating item:", error.message);
        throw new Error("Failed to update item.");
      }

      return { message: "Item updated successfully!" };
    }
  );

export const deleteImage = authClient
  .bindArgsSchemas<
    [postId: z.ZodString, imageId: z.ZodString]
  >([z.string(), z.string()])
  .action(async ({ bindArgsParsedInputs: [postId, imageId] }) => {
    const { error } = await supabase.storage
      .from("item-images")
      .remove([`${postId}/${imageId}`]);

    if (error) {
      console.error("Error deleting image from storage:", error.message);
      throw new Error("Failed to delete image from storage.");
    }

    return { message: "Image deleted successfully!" };
  });
