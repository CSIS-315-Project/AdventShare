import * as z from "zod";

export const EditSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    description: z.string().min(5, {
      message: "Description must be at least 5 characters.",
    }).nullable(),
    quantity: z.coerce.number().min(1, {
      message: "Quantity is required.",
    }),
    category_id: z.string().min(1, {
      message: "Category is required.",
    }),
    is_public: z.boolean(),
  });
