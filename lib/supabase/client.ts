import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Not used by the POC yet — the app runs on
 * the in-memory mock data layer in lib/data/store.ts. This is scaffolding
 * for wiring up real persistence + auth later (see README "Next steps").
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
