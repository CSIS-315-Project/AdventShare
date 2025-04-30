import { z } from "zod"


// Item in claim
export const ClaimItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  school: z.string(),
  category: z.string(),
  estimatedValue: z.number().optional(),
  availableQuantity: z.number().optional(),
})

// Claim schema
export const ClaimSchema = z.object({
  id: z.string(),
  item: ClaimItemSchema,
  status: z.string(),
  quantity: z.number().int().positive(),
  claimDate: z.string(),
  responseDate: z.string().optional(),
  notes: z.string().nullable(),
  responseMessage: z.string().optional(),
})

// Update claim input schema
export const UpdateClaimInputSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
})

// Response schema
export const ClaimResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

// TypeScript types
export type ClaimItem = z.infer<typeof ClaimItemSchema>
export type Claim = z.infer<typeof ClaimSchema>
export type UpdateClaimInput = z.infer<typeof UpdateClaimInputSchema>
export type ClaimResponse = z.infer<typeof ClaimResponseSchema>
