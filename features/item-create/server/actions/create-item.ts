"use server"

import { z } from "zod"
import type { ItemFormData } from "../../schemas/item"
import type { CreateItemResult } from "../../types"
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client"
import { authClient } from "@/lib/safe-actions"
import { itemSchema } from "@/schemas/items"

const supabase = await createClerkSupabaseClientSsr()

export const createItem = authClient
  .schema(itemSchema)
  .action(
    async (data: ItemFormData): Promise<CreateItemResult> => {
      const { name, description, price, image_url } = data

      const { data: item, error } = await supabase
        .from("items")
        .insert({
          name,
          description,
          price,
          image_url,
        })
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        item,
      }
    },
  )
