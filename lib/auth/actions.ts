"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfileByEmail } from "@/lib/data/store";
import { SESSION_COOKIE, roleHome } from "@/lib/auth/session";

export async function loginWithEmail(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const profile = getProfileByEmail(email);

  if (!profile) {
    return { error: "לא מצאנו חשבון הדגמה עם האימייל הזה. נסו אחד מחשבונות ההדגמה למטה." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, profile.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(roleHome(profile.role));
}

export async function loginAsDemoRole(email: string) {
  const profile = getProfileByEmail(email);
  if (!profile) return;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, profile.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(roleHome(profile.role));
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}
