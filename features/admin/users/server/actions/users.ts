"use server";

import { adminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { z } from "zod";
import { userEditSchema } from "../../schemas/users";



  export const edit = adminClient
  .schema(userEditSchema)
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: {
        username,
        firstName,
        lastName,
        password,
      },
      bindArgsParsedInputs: [userId],
    }) => {
      try {
        const client = await clerkClient();

        await client.users.updateUser(userId, {
          username,
          firstName,
          lastName,
          password,
        });

        return { message: "Organization created successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the user metadata." };
      }
    }
  );

  export const deleteUser = adminClient
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [userId],
    }) => {
      try {
        const client = await clerkClient();

        await client.users.deleteUser(userId);

        return { message: "User deleted successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error updating the user metadata." };
      }
    }
  );