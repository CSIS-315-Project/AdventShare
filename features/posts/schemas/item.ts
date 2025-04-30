import { ItemStatusSchema, SchoolSchema } from "@/types/item";
import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
});

export const ItemSchemaEdit = z.object({
  name: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory:  z.string().optional(),
  images: z.array(z.string().nullable()).optional(),
  quantity: z.number().int().positive().optional(),
  availableQuantity: z.number().int().min(0).optional(),
  estimatedValue: z.number().nonnegative().optional(),
  isPublic: z.boolean().optional(),
  condition: z.string().optional().nullable(),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemEdit = z.infer<typeof ItemSchemaEdit>;