import {
  createMiddleware,
  createSafeActionClient,
} from "next-safe-action";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { Staff } from "@/types/staff";

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e: Error) {
    throw new Error(e.message);
  },
});

export const organizationAdminMiddleware = createMiddleware().define(
  async ({ next, bindArgsClientInputs, ctx }) => {
    if (!ctx) {
      throw new Error("Unauthorized");
    }

    // May be a slug.
    const organizationId = bindArgsClientInputs[0] as string;

    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      organizationId,
    });
    if (!organization) {
      throw new Error("Organization not found");
    }

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to perform this action.");
    }

    const data = await fetch(
      `https://api.clerk.com/v1/organizations/${organization.id}/memberships?limit=${1}&user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!data.ok) {
      console.log(data)
      throw new Error("Error");
    }

    const json = (await data.json()) as { data: Staff[]; total_count: number };

    if (json.data.length === 0) {
      throw new Error("You are not a member of this organization.");
    }

    if (json.data[0].role !== "org:admin") {
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

export const authClientwOrg = actionClient.use(
  async ({ next, bindArgsClientInputs }) => {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to perform this action.");
    }

    const organizationId = bindArgsClientInputs[0] as string;

    return next({
      ctx: {
        userId,
        organizationId,
        metadata: sessionClaims?.metadata,
      },
    });
  }
);
