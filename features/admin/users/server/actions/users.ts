"use server";

import { adminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { z } from "zod";
import { userSchema } from "../../schemas/users";

export const create = adminClient
  .schema(userSchema)
  .action(
    async ({
      parsedInput: {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        role,
        school,
      },
    }) => {
      const client = await clerkClient();

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      console.log({ email, firstName, lastName, password, confirmPassword, role, school });

      const newUser = await client.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        password,
        createdAt: new Date(),
        publicMetadata: {
          role
        }
      });

      if (school) {
        await client.users.updateUser(newUser.id, {
          publicMetadata: {
            school: school.id,
            onboardingComplete: false
          },
        });

        await client.organizations.createOrganizationMembership({
          organizationId: school.id,
          userId: newUser.id,
          role: role,
        });
      }

      return { message: "User created successfully!" };
    }
  );

export const edit = adminClient
  .schema(userSchema)
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: { username, firstName, lastName, password },
      bindArgsParsedInputs: [userId],
    }) => {
      const client = await clerkClient();

      await client.users.updateUser(userId, {
        username,
        firstName,
        lastName,
        password,
      });

      return { message: "Organization created successfully!" };
    }
  );

export const deleteUser = adminClient
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(async ({ bindArgsParsedInputs: [userId] }) => {
    const client = await clerkClient();

    await client.users.deleteUser(userId);

    return { message: "User deleted successfully!" };
  });
