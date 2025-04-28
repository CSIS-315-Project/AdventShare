"use server";

import { authClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";

import { formSchema } from "@/features/auth/schemas/onboarding";
import resend from "@/lib/resend";

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

      const message = `
            <div style="max-width: 600px; background-color: #ffffff; padding: 40px; margin: 0 auto; border-radius: 8px;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Welcome to AdventShare, ${res.firstName || "New User"}!</h1>
            <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">We're excited to have you on board.</p>
            <p style="font-size: 16px; margin-bottom: 10px;">
              AdventShare is here to help you connect and collaborate with schools to share items that may be hard to come by or are outright expensive, for free!
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Get started by discovering the many items that are already available!
            </p>
            <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">View Posts</a>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              If you have any questions, feel free to reach out to us at support@adventshare.com.
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              Thank you for joining AdventShare!
            </p>
            </div>
          `;
      
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: res.emailAddresses[0].emailAddress,
          subject: `Welcome to AdventShare, ${res.firstName || "New User"}!`,
          html: message,
        });

      return { message: res.publicMetadata };
    } catch (err) {
      console.log(err);
      return { error: "There was an error updating the user metadata." };
    }
  });