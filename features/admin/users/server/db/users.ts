import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export async function getUsers({ limit = 10, offset = 0, query }: {
    limit?: number;
    offset?: number;
    query?: string;
}) {
    const auth = await clerkClient();

    return auth.users.getUserList({
        limit,
        offset,
        query
    });
}