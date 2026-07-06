import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getTeamsForCoach, getPlayersByTeam } from "@/lib/data/store";
import { getPlayerRowsForTeam } from "@/lib/data/metrics";

export default async function CoachTeamsPage() {
  const profile = await requireProfile("coach");
  const teams = getTeamsForCoach(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">{teams.length} teams assigned to you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const players = getPlayersByTeam(team.id);
          const rows = getPlayerRowsForTeam(team.id).filter((r) => r.player.parentConsentStatus === "approved");
          const totals = rows.reduce(
            (acc, r) => {
              acc.completed += r.progress.completed;
              acc.total += r.progress.total;
              return acc;
            },
            { completed: 0, total: 0 }
          );
          const rate = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
          const flags = rows.reduce((sum, r) => sum + r.openFlags.length, 0);

          return (
            <Link key={team.id} href={`/coach/teams/${team.id}`}>
              <Card className="h-full hover:border-accent/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.name}</CardTitle>
                    {flags > 0 && <Badge variant="warning">{flags} flag{flags === 1 ? "" : "s"}</Badge>}
                  </div>
                  <CardDescription>{players.length} players · {team.ageGroup}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Weekly completion</span>
                      <span>{rate}%</span>
                    </div>
                    <Progress value={rate} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    View roster <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
