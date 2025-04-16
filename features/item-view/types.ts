import { z } from "zod";

// Zod schemas for validation
export const SchoolSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export const ItemStatusSchema = z.enum([
  "Available",
  "Claimed",
  "Pending Approval",
]);

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  postedDate: z.string(),
  status: ItemStatusSchema,
  images: z.array(z.string()) || null,
  school: SchoolSchema,
});

export const SimilarItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: ItemStatusSchema,
  image: z.string(),
  school: z.string(),
});

export const ClaimResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// TypeScript types derived from Zod schemas
export type School = z.infer<typeof SchoolSchema>;
export type ItemStatus = z.infer<typeof ItemStatusSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type SimilarItem = z.infer<typeof SimilarItemSchema>;
export type ClaimResponse = z.infer<typeof ClaimResponseSchema>;
