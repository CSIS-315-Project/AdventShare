"use server";

import { z } from "zod";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { authClient } from "@/lib/safe-actions";
import { createItemSchema } from "@/features/item-create/schemas/items";
import { getOrganization } from "@/features/auth/server/db/organizations";
import { redirect } from "next/navigation";

const supabase = await createClerkSupabaseClientSsr();

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
        images,
      },
      ctx: { userId },
    }) => {
      try {
        const org = await getOrganization();
        if (!org) {
          throw new Error("Organization not found");
        }

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
            organization_id: org.id, // Removed orgId as it's not available in the context
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (error) {
          console.error("Error creating item:", error);
          throw new Error(`Failed to create item: ${error.message}`);
        }

        const uploadPromises = images.map((image, index) =>
          supabase.storage
            .from("item-images")
            .upload(`${data.id}/image-${index}`, image, {
              contentType: image.type,
              upsert: true,
            })
        );

        const uploadResults = await Promise.all(uploadPromises);

        const failedUploads = uploadResults.filter((result) => result.error);
        if (failedUploads.length > 0) {
          console.error("Some images failed to upload:", failedUploads);
          throw new Error("Failed to upload one or more images.");
        }

        return { id: data.id };
      } catch (error) {
        console.error("Error creating item:", error);
        throw error;
      }
    }
  );
