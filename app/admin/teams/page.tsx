import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getSchool, getTeams, getPlayersByTeam, getProfileById } from "@/lib/data/store";
import { getPlayerRowsForTeam } from "@/lib/data/metrics";

export default function AdminTeamsPage() {
  const school = getSchool();
  const teams = getTeams(school.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">קבוצות</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {teams.length} קבוצות ב-{school.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const players = getPlayersByTeam(team.id);
          const rows = getPlayerRowsForTeam(team.id);
          const active = rows.filter((r) => r.player.parentConsentStatus === "approved");
          const totals = active.reduce(
            (acc, r) => {
              acc.completed += r.progress.completed;
              acc.total += r.progress.total;
              return acc;
            },
            { completed: 0, total: 0 }
          );
          const rate = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
          const openFlags = rows.reduce((sum, r) => sum + r.openFlags.length, 0);
          const coach = getProfileById(team.coachId);

          return (
            <Link key={team.id} href={`/admin/teams/${team.id}`}>
              <Card className="h-full hover:border-accent/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.name}</CardTitle>
                    {openFlags > 0 && (
                      <Badge variant="warning">{openFlags} {openFlags === 1 ? "דגל" : "דגלים"}</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {players.length} שחקנים · מאמן {coach?.fullName ?? "לא משויך"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>השלמה שבועית</span>
                      <span>{rate}%</span>
                    </div>
                    <Progress value={rate} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    צפייה בקבוצה <ArrowLeft className="h-3.5 w-3.5" />
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
