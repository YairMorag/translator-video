import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth/session";
import { getSchool } from "@/lib/data/store";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile("coach");
  const school = getSchool();

  return (
    <AppShell role="coach" userName={profile.fullName} schoolName={school.name}>
      {children}
    </AppShell>
  );
}
