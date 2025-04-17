import { z } from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  subcategory_id: z.string(),
  user_id: z.string(),
  user_name: z.string().optional(), // Optional, can be used for display purposes
  organization_id: z.string().optional(), // Optional, can be used for display purposes
  organization_name: z.string().optional(), // Optional, can be used for display purposes
  created_at: z.date(),
  updated_at: z.date(),
  is_public: z.boolean(),
  status: z.string(),
  condition: z.string().optional(), // Optional, can be used for display purposes
  value: z.number().optional(), // Optional, can be used for display purposes
  image_url: z.string().optional(), // Optional, can be used for display purposes
});
