"use server";

import { adminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { organizationEditSchema, organizationSchema } from "../../schemas/organization";
import { z } from "zod";

export const create = adminClient
  .schema(organizationSchema)
  .action(
    async ({
      parsedInput: {
        address,
        city,
        description,
        email,
        name,
        phone,
        state,
        website,
        zipCode,
      },
      ctx: { userId },
    }) => {
      try {
        const client = await clerkClient();

        await client.organizations.createOrganization({
          name,
          createdBy: userId,
          publicMetadata: {
            address,
            city,
            state,
            zipCode,
            email,
            phone,
            website,
            description,
          },
        });

        return { message: "Organization created successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the user metadata." };
      }
    }
  );


  export const edit = adminClient
  .schema(organizationEditSchema)
  .bindArgsSchemas<[organizationId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: {
        address,
        name,
        phone,
      },
      bindArgsParsedInputs: [organizationId],
    }) => {
      try {
        const client = await clerkClient();

        await client.organizations.updateOrganization(organizationId, {
          name,
          publicMetadata: {
            address,
            phone,
          },
        });

        return { message: "Organization created successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the user metadata." };
      }
    }
  );

  export const deleteOrganization = adminClient
  .bindArgsSchemas<[organizationId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [organizationId],
    }) => {
      try {
        const client = await clerkClient();

        await client.organizations.deleteOrganization(organizationId);

        return { message: "Organization deleted successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the user metadata." };
      }
    }
  );