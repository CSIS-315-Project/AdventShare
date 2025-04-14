"use server";

import { adminClient } from "@/lib/safe-actions";

import {supabase} from "@/lib/supabase/server";

import { EditSchema } from "../../schemas/posts";
import { z } from "zod";

export const edit = adminClient
  .schema(EditSchema)
  .bindArgsSchemas<[postId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: { 
        name,
        description,
        quantity,
        category_id,
        is_public,
       },
      bindArgsParsedInputs: [postId],
    }) => {
      try {
        // Use supabase and edit the post.
        const { data, error } = await supabase
          .from("items")
          .update({
            name,
            description,
            quantity,
            subcategory_id: category_id,
            is_public,
          })
          .eq("id", postId);

        if (error) {
          throw new Error(error.message);
        }

        return { message: "Post updated successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the post." };
      }
    }
  );