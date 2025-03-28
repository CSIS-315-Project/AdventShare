import "server-only";

import { auth } from '@clerk/nextjs/server'
import { createClient } from "@supabase/supabase-js";

export async function createClerkSupabaseClientSsr() {
  const { getToken } = await auth()

  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLIC_KEY!,
    {
      global: {
        // Get the custom Supabase token from Clerk
        fetch: Object.assign(
          async (url: RequestInfo | URL, options: RequestInit = {}) => {
            const clerkToken = await getToken({
              template: 'supabase',
            })

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            })
          },
          { preconnect: () => {} }
        ),
      },
    },
  )
}