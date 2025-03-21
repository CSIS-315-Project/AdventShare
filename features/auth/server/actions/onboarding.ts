"use server";

import { authClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { formSchema } from "@/features/auth/schemas/onboarding";

export const completeOnboarding = authClient
  .schema(formSchema)
  .action(async ({ parsedInput: { school }, ctx: { userId }}) => {
    try {
      const client = await clerkClient();

      const res = await client.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
          school: school,
        },
      });
      return { message: res.publicMetadata };
    } catch (err) {
      console.log(err);
      return { error: "There was an error updating the user metadata." };
    }
  });