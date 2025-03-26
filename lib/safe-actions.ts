import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE, } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e: Error) {
    throw new Error(e.message);
  },
});

export const adminClient = actionClient
  .use(async ({ next }) => {
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
