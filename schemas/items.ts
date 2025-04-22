import { z } from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  category_id: z.string().optional(),
  subcategory_id: z.string(),
  user_id: z.string(),
  user_name: z.string().optional(),
  organization_id: z.string().optional(),
  organization_name: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  is_public: z.boolean(),
  status: z.string(),
  condition: z.string().optional(),
  value: z.number().optional(),
  image_url: z.string().optional(),
});
