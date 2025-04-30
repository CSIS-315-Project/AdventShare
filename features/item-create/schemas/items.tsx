import { z } from "zod";

// Schema for category table
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  created_at: z.string().optional()
});

// Schema for subcategory table (references category)
export const subcategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  category_id: z.string(), // Foreign key to categories table
  description: z.string().optional().nullable(),
  created_at: z.string().optional()
});

// Schema for item creation
export const createItemSchema = z.object({
  name: z.string().min(3, { message: "Item name must be at least 3 characters" }),
  description: z.string().optional(),
  subcategory: z.string(), // Foreign key to subcategories table
  condition: z.string().optional(),
  quantity: z.number().int().positive(),
  estimatedValue: z.number().nonnegative().optional(),
  is_public: z.boolean(),
  images: z.array(z
    .instanceof(File)
    .refine((file) => file?.size <= 5000000, `Max image size is 5MB.`)
    .refine(
      (file) => [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
      ].includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ))
});

// Schema for item (database model)
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  subcategory_id: z.string(), // Foreign key to subcategories table
  condition: z.string().nullable(),
  quantity: z.number().int().positive(),
  value: z.number().nonnegative().nullable(),
  user_id: z.string(),
  organization_id: z.string().nullable(),
  is_public: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string()
});

// Schema for claim (references item)
export const claimSchema = z.object({
  id: z.string().optional(),
  item_id: z.string(), // Foreign key to items table
  user_id: z.string(),
  organization_id: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  quantity: z.number().int().positive(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// TypeScript types derived from Zod schemas
export type Category = z.infer<typeof categorySchema>;
export type Subcategory = z.infer<typeof subcategorySchema>;
export type CreateItem = z.infer<typeof createItemSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Claim = z.infer<typeof claimSchema>;
