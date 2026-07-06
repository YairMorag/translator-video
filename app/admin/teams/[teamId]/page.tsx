import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TeamRosterTable } from "@/components/team-roster-table";
import { getTeamById, getProfileById } from "@/lib/data/store";
import { getPlayerRowsForTeam } from "@/lib/data/metrics";

export default async function AdminTeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = getTeamById(teamId);
  if (!team) notFound();

  const coach = getProfileById(team.coachId);
  const rows = getPlayerRowsForTeam(team.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{team.ageGroup} · {team.season}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Coach {coach?.fullName ?? "Unassigned"} · {rows.length} players</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
          <CardDescription>Consent, adherence, and safety status for every player on this team.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamRosterTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
