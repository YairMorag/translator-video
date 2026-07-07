import { notFound } from "next/navigation";
import Link from "next/link";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamRosterTable } from "@/components/team-roster-table";
import { getTeamById } from "@/lib/data/store";
import { getPlayerRowsForTeam } from "@/lib/data/metrics";

export default async function CoachTeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const profile = await requireProfile("coach");
  const { teamId } = await params;
  const team = getTeamById(teamId);
  if (!team || team.coachId !== profile.id) notFound();

  const rows = getPlayerRowsForTeam(team.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">{team.ageGroup} · {team.season}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} שחקנים בקבוצה זו</p>
        </div>
        <Button asChild>
          <Link href={`/coach/assign?teamId=${team.id}`}>הקצאת משימות לקבוצה זו</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>סד השחקנים</CardTitle>
          <CardDescription>הקישו על שחקן כדי לראות את הפרופיל המלא, הדוחות וההערות שלו.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamRosterTable rows={rows} playerHref={(id) => `/coach/players/${id}`} />
        </CardContent>
      </Card>
    </div>
  );
}
