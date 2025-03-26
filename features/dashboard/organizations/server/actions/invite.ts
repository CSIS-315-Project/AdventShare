"use server"

import { auth, clerkClient } from "@clerk/nextjs";
import { inviteStaffSchema } from "../../schemas/staff";

export async function inviteStaffMember(data: {
  email: string;
  role: string;
  organizationId: string;
}) {
  const { orgId } = auth();
  
  if (!orgId) throw new Error("Unauthorized");

  const validated = inviteStaffSchema.parse(data);

  try {
    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: validated.email,
      role: validated.role,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to invite staff member" };
  }
} 