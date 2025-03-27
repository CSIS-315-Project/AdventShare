import {
  createMiddleware,
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { Staff } from "@/types/staff";

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e: Error) {
    throw new Error(e.message);
  },
});

export const organizationAdminMiddleware = createMiddleware<{}>().define(
  async ({ next, bindArgsClientInputs, ctx, metadata }) => {
    if (!ctx) {
      throw new Error("Unauthorized");
    }

    const organizationId = bindArgsClientInputs[0] as string;

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to perform this action.");
    }

    const data = await fetch(
      `https://api.clerk.com/v1/organizations/${organizationId}/memberships?limit=${1}&query=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!data.ok) {
      throw new Error("You are not a member of this organization.");
    }

    const json = (await data.json()) as { data: Staff[]; total_count: number };

    if (json.data.length === 0) {
      throw new Error("You are not a member of this organization.");
    }

    if (json.data[0].role !== "admin") {
      throw new Error("You are not an admin of this organization.");
    }

    return next({
      ctx: {
        userId,
        metadata: sessionClaims?.metadata,
      },
    });
  }
);

export const adminClient = actionClient.use(async ({ next }) => {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to perform this action.");
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("You must be an admin to perform this action.");
  }

  return next({
    ctx: {
      userId,
      metadata: sessionClaims?.metadata,
    },
  });
});

export const organizationAdminClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      permissionRequirement: z.union([z.string(), z.array(z.string())]),
    }),
  handleServerError: (e) => {
    console.error(e);
    throw new Error(e.message);
  },
})
  .use(async ({ next }) => {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to perform this action.");
    }

    return next({
      ctx: {
        userId,
        metadata: sessionClaims?.metadata,
      },
    });
  })
  .use(organizationAdminMiddleware);

export const authClient = actionClient.use(async ({ next }) => {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to perform this action.");
  }

  return next({
    ctx: {
      userId,
      metadata: sessionClaims?.metadata,
    },
  });
});
