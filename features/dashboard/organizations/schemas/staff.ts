import { z } from "zod";

export const inviteStaffSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

export const updatePermissionsSchema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
  organizationId: z.string()
}); 