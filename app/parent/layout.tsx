import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth/session";
import { getSchool } from "@/lib/data/store";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile("parent");
  const school = getSchool();

  return (
    <AppShell role="parent" userName={profile.fullName} schoolName={school.name}>
      {children}
    </AppShell>
  );
}
