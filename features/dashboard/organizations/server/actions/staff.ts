"use server";

import { organizationAdminClient } from "@/lib/safe-actions";

import { clerkClient } from "@clerk/nextjs/server";
import { inviteStaffSchema } from "../../schemas/staff";
import { z } from "zod";
import resend from "@/lib/resend";

export const invite = organizationAdminClient
  .schema(inviteStaffSchema)
  .bindArgsSchemas<[organizationId: z.ZodString]>([z.string()])
  .action(
    async ({
      parsedInput: { email, role },
      bindArgsParsedInputs: [organizationId],
    }) => {
      const client = await clerkClient();

        const organization = await client.organizations.getOrganization({
            organizationId,
        });
        if (!organization) {
            throw new Error("Organization not found");
        }

      const invite = await client.organizations.createOrganizationInvitation({
        organizationId: organization.id,
        emailAddress: email,
        role: role,
      });

      const users = await client.users.getUserList({ query: email, limit: 1 });
      if (users.totalCount === 0 || !users.data[0]) {
        return { message: "User not found" };
      }

      const user = users.data[0];

      const message = `
          <div style="max-width: 600px; background-color: #ffffff; padding: 40px; margin: 0 auto; border-radius: 8px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">You're Invited to Join ${organization.name}</h1>
          <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">Hi ${user.firstName || "there"},</p>
          <p style="font-size: 16px; margin-bottom: 10px;">
        You have been invited to join <strong>${organization.name}</strong> as a <strong>${role}</strong>.
          </p>
          <p style="font-size: 16px; margin-bottom: 30px;">
        Click the button below to accept your invitation and get started:
          </p>
          <a href="${invite.url}" style="display: inline-block; padding: 10px 20px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Accept Invitation</a>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        If you have any questions, feel free to reach out to us.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
        Thank you for using AdventShare!
          </p>
          </div>
        `;

      resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Invitation to join ${organization.name} on AdventShare!`,
        html: message,
      });

      return { success: true };
    }
  );

export const remove = organizationAdminClient
  .bindArgsSchemas<
    [organizationId: z.ZodString, userId: z.ZodString]
  >([z.string(), z.string()])
  .action(async ({ bindArgsParsedInputs: [organizationId, userId] }) => {
    const client = await clerkClient();

    const organization = await client.organizations.getOrganization({
      organizationId,
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    console.log(organization.id);
    console.log(userId);

    const deletedUser = await client.organizations.deleteOrganizationMembership(
      {
        organizationId: organization.id,
        userId,
      }
    ).catch(err => {
        console.log(err)
    });

    if (!deletedUser) {
        throw new Error("User not found");
    }

    console.log(deletedUser);

    const user = await client.users.getUser(userId);

    const message = `
        <div style="max-width: 600px; background-color: #ffffff; padding: 40px; margin: 0 auto; border-radius: 8px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">You Have Been Removed from ${organization.name}</h1>
        <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">Hi ${user.firstName || "there"},</p>
        <p style="font-size: 16px; margin-bottom: 10px;">
            We wanted to let you know that you have been removed from the organization <strong>${organization.name}</strong>.
        </p>
        <p style="font-size: 16px; margin-bottom: 30px;">
            If you believe this was a mistake or have any questions, please feel free to reach out to us.
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Thank you for using AdventShare!
        </p>
        </div>
      `;

    resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.emailAddresses[0].emailAddress,
      subject: `You have been removed from ${organization.name}`,
      html: message,
    });

    return { success: true };
  });
