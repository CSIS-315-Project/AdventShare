import { z } from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  category_id: z.string(),
  user_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  is_public: z.boolean(),
});
