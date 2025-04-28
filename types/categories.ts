import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    created_at: z.date(),
});

export const SubcategorySchema = z.object({
    id: z.string(),
    categoryid: z.string(),
    name: z.string(),
    created_at: z.date(),
});