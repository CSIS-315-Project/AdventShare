"use server";

import { z } from "zod";
import { ClaimResponseSchema, type ClaimResponse } from "@/types/item";
import { createClerkSupabaseClientSsr } from "@/lib/supabase/ssr/client";
import { authClient } from "@/lib/safe-actions";
import resend from "@/lib/resend";
import { clerkClient } from "@clerk/nextjs/server";

// Initialize Supabase client
const supabase = await createClerkSupabaseClientSsr();

const claimSchema = z.object({
  item_id: z.string(),
  user_id: z.string(),
  organization_id: z.string(),
  item_name: z.string().optional(),
  poster_id: z.string(),
  status: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
});

export const claimItem = authClient
  .schema(claimSchema)
  .action(
    async ({
      parsedInput: { item_id, organization_id, quantity, item_name, poster_id },
      ctx: { userId },
    }) => {
      try {
        const supabase = await createClerkSupabaseClientSsr();

        // Insert claim into database
        const { data, error } = await supabase
          .from("claims")
          .insert({
            item_id,
            user_id: userId,
            organization_id,
            status: "pending",
            quantity: quantity || 1,
          } as z.infer<typeof claimSchema>)
          .select()
          .single();

        if (error) {
          console.error("Error inserting claim:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        if (data) {
          const auth = await clerkClient();
          const user = await auth.users.getUser(userId).catch(() => null);

          const poster = await auth.users.getUser(poster_id).catch(() => null);

          if (!user) {
            throw new Error("User not found.");
          }

          if (!poster) {
            throw new Error("Poster not found.");
          }

          // const itemUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/items/${item_id}`;
            const message = `
            <div style="max-width: 600px; background-color: #ffffff; padding: 40px; margin: 0 auto; border-radius: 8px;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">
              Pending Claim Request for Your Item: ${item_name ?? "your item"}
              </h1>
              <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">Hi ${user.firstName ?? "there"},</p>
              <p style="font-size: 16px; margin-bottom: 10px;">
              Someone has requested to claim <strong>${item_name ?? "your item"}</strong>. Please review and take action in your AdventShare dashboard.
              </p>
              <p style="font-size: 16px; margin-bottom: 10px;">
              If you need more information, you can reply to this email to contact the requester directly.
              </p>
              <p>
              Thank you for sharing on AdventShare!
              </p>
            </div>
            `;

          resend.emails.send({
            from:   
              user.primaryEmailAddress?.emailAddress ??
              user.emailAddresses[0].emailAddress,
            to:
              poster.primaryEmailAddress?.emailAddress ??
              poster.emailAddresses[0].emailAddress,
            cc: [
              user.primaryEmailAddress?.emailAddress ??
              user.emailAddresses[0].emailAddress,
            ],
            subject: `Claim Request Pending for ${item_name}`,
            html: message,
          });
        }

        return { message: "Claim submitted successfully!" };
      } catch (err) {
        console.log(err);
        return { error: "There was an error creating claim." };
      }
    }
  );
