import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type CreateClientOptions = {
  /** Extra request headers forwarded to PostgREST (e.g. the visitor IP for rate limiting). */
  headers?: Record<string, string>;
};

/**
 * Anonymous, cookie-less Supabase client. The site only reads public content
 * and inserts public form submissions, so no auth session is involved — and
 * avoiding `cookies()` keeps it usable in static routes, the sitemap and
 * `generateStaticParams`.
 */
export async function createClient({ headers }: CreateClientOptions = {}) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: headers ? { headers } : undefined,
    },
  );
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
