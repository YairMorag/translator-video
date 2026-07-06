import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth/session";
import { getSchool } from "@/lib/data/store";

export default async function PlayerLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile("player");
  const school = getSchool();

  return (
    <AppShell role="player" userName={profile.fullName} schoolName={school.name}>
      {children}
    </AppShell>
  );
}
