import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
});

export const SubcategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category_id: z.string(),
  created_at: z.string(),
});
