import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional(),
  confirmPassword: z
    .string()
    .min(6, {
      message: "Confirm password must be at least 6 characters.",
    })
    .optional(),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  school: z
    .object({
      id: z.string().min(2, {
        message: "School must be at least 2 characters.",
      }),
      name: z.string().min(2, {
        message: "School must be at least 2 characters.",
      }),
    })
    .optional(),
});

export const userEditSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional(),
});

