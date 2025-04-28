import { z } from "zod"

export const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1").optional(),
  availableQuantity: z.number().int().min(0, "Available quantity cannot be negative").optional(),
  estimatedValue: z.number().nonnegative("Value cannot be negative").optional(),
  isPublic: z.boolean().default(true),
  condition: z.string().min(1, "Condition is required"),
  images: z.array(z.string()).optional(),
})

export type ItemFormData = z.infer<typeof ItemSchema>
