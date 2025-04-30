"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { authClient } from "@/lib/safe-actions";
import resend from "@/lib/resend";
import { clerkClient } from "@clerk/nextjs/server";

export const updateClaimStatus = authClient
  .bindArgsSchemas<
    [postId: z.ZodString, status: z.ZodString]
  >([z.string(), z.string()])
  .action(async ({ bindArgsParsedInputs: [postId, status] }) => {
    const { data: updatedItem, error } = await supabase
      .from("claims")
      .update({
        status,
      })
      .eq("id", postId)
      .select("*, items (*)")
      .single();

    if (error) {
      console.error("Error updating item:", error.message);
      throw new Error("Failed to update item.");
    }

    if (!updatedItem) {
      throw new Error("Item not found.");
    }

    const auth = await clerkClient();
    const user = await auth.users
      .getUser(updatedItem.user_id)
      .catch(() => null);

    if (!user) {
      throw new Error("User not found.");
    }

    // Get base url
    const itemUrl = `http://localhost:3000/items/${updatedItem.items.id}`;
    const message = `
	  <div style="max-width: 600px; background-color: #ffffff; padding: 40px; margin: 0 auto; border-radius: 8px;">
		<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Your Claim Request for <a href="${itemUrl}" style="color: #1d4ed8; text-decoration: underline;">${updatedItem.items.name}</a></h1>
		<p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">Hi ${user.firstName},</p>
		<p style="font-size: 16px; margin-bottom: 10px;">
		  Your claim request for <strong>${updatedItem.items.name}</strong> has been 
		  <strong style="color: {{statusColor}};">${status}</strong>.
		</p>
		<p>
		 Thank you for using AdventShare!
		</p>
	  </div> 
	`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to:
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0].emailAddress,
      subject: `Claim ${status}`,
      html: message,
    });

    return { message: "Claim updated successfully!" };
  });
