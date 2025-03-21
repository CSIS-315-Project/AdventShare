"use server";

import { adminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { organizationSchema } from "../../schemas/organization";

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
