"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  school: z.string().min(3),
});

type FormTypes = z.infer<typeof formSchema>;

export const completeOnboarding = async (formData: FormTypes) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        school: formData.school,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    console.log(err);
    return { error: "There was an error updating the user metadata." };
  }
};
