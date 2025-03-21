import { z } from "zod";

export const formSchema = z.object({
  school: z.string().min(3),
});
