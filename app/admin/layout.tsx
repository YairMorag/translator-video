import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth/session";
import { getSchool } from "@/lib/data/store";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile("school_admin");
  const school = getSchool();

  return (
    <AppShell role="school_admin" userName={profile.fullName} schoolName={school.name}>
      {children}
    </AppShell>
  );
}
