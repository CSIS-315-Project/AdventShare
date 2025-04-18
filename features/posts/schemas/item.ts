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
  name: z.string().optional(),
  description: z.string().optional(),
  subcategory: z.string().optional(),
  public: z.boolean().optional(),
  condition: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  value: z.number().nonnegative().optional(),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemEdit = z.infer<typeof ItemSchemaEdit>;