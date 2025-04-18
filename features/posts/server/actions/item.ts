"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { ItemSchema } from "@/types/item";
import { ItemSchemaEdit } from "@/features/posts/schemas/item";

export async function fetchItem(itemId: string) {
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("Error fetching item:", error.message);
    throw new Error("Failed to fetch item.");
  }

  return ItemSchema.parse(item);
}

export async function updateItem(itemId: string, updatedData: z.infer<typeof ItemSchemaEdit>) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to update an item.");
  }

  const validatedData = ItemSchemaEdit.parse(updatedData);

  const { data: updatedItem, error } = await supabase
    .from("items")
    .update({
      name: validatedData.name,
      description: validatedData.description,
      subcategory_id: validatedData.subcategory,
      is_public: validatedData.public,
      condition: validatedData.condition,
      quantity: validatedData.quantity,
      updated_at: new Date().toISOString(),
      value: validatedData.value,
    })
    .eq("id", itemId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating item:", error.message);
    throw new Error("Failed to update item.");
  }

  return ItemSchema.parse(updatedItem);
}