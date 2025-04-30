"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { InviteStaffSchema } from "@/features/organizations/schemas/staff";
import { authClient } from "@/lib/safe-actions";

export const inviteUser = authClient
  .schema(InviteStaffSchema)
  .bindArgsSchemas<[postId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: {
        email,
        role
      },
      bindArgsParsedInputs: [organizationId],
    }) => {
      

      return { message: "User invited" };
    }
  );
