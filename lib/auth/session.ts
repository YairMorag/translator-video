import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Profile, Role } from "@/lib/types";
import { getProfileById } from "@/lib/data/store";

// Demo-mode session: a single cookie holding the active profile id.
// This is intentionally structured as a drop-in seam for Supabase Auth —
// swap getCurrentProfile()'s cookie lookup for a Supabase session lookup
// and every page that calls requireProfile()/getCurrentProfile() keeps working.
export const SESSION_COOKIE = "np_session";

export function roleHome(role: Role): string {
  switch (role) {
    case "school_admin":
      return "/admin";
    case "coach":
      return "/coach";
    case "parent":
      return "/parent";
    case "player":
      return "/player";
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const jar = await cookies();
  const profileId = jar.get(SESSION_COOKIE)?.value;
  if (!profileId) return null;
  return getProfileById(profileId) ?? null;
}

export async function requireProfile(role?: Role | Role[]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  const allowedRoles = Array.isArray(role) ? role : role ? [role] : undefined;
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect(roleHome(profile.role));
  }
  return profile;
}
