import * as z from "zod";

export const organizationSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
    city: z.string().min(2, {
      message: "City is required.",
    }),
    state: z.string().min(2, {
      message: "State is required.",
    }),
    zipCode: z.string().min(5, {
      message: "Zip code must be at least 5 characters.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    website: z
      .string()
      .url({
        message: "Please enter a valid URL.",
      })
      .optional()
      .or(z.literal("")),
    description: z.string().optional(),
  });

  export const organizationEditSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
  });