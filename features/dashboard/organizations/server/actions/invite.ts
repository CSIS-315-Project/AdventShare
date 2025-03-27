"use server";

import { organizationAdminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";
import { inviteStaffSchema } from "../../schemas/staff";
import { z } from "zod";

export const invite = organizationAdminClient
  .schema(inviteStaffSchema)
  .bindArgsSchemas<[organizationId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: { email, role },
      bindArgsParsedInputs: [organizationId],
    }) => {
      const client = await clerkClient();

      await client.organizations.createOrganizationInvitation({
        organizationId,
        emailAddress: email,
        role: role,
      });

      return { success: true };
    }
  );
