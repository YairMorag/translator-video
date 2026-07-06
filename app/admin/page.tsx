import Link from "next/link";
import { Users2, ClipboardCheck, TrendingUp, ShieldAlert, UserCog, Percent } from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { RiskBadge } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { CompletionByTeamChart, AdherenceTrendChart } from "@/components/charts/dashboard-charts";
import { getSchool, getPlayerById, getCoaches, getTeamsForCoach, getPlayersForCoach, getRiskFlags } from "@/lib/data/store";
import { computeAdminDashboardStats } from "@/lib/data/metrics";
import { currentWeekLabel, formatDate } from "@/lib/date";

export default async function AdminDashboardPage() {
  const school = getSchool();
  const stats = computeAdminDashboardStats(school.id);
  const openRiskFlags = getRiskFlags(school.id).filter((f) => f.status === "open");
  const coaches = getCoaches(school.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">{school.name} · Week of {currentWeekLabel()}</p>
          <h1 className="text-2xl font-semibold tracking-tight">School Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Is the school getting value from this system?</p>
        </div>
        <Button asChild>
          <Link href="/admin/teams">View Teams</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active players" value={stats.totalActivePlayers} icon={Users2} />
        <StatCard label="Active teams" value={stats.activeTeams} icon={ClipboardCheck} />
        <StatCard label="Weekly engagement" value={`${stats.weeklyEngagementRate}%`} icon={TrendingUp} tone="success" />
        <StatCard label="Avg completion rate" value={`${stats.averageCompletionRate}%`} icon={Percent} />
        <StatCard label="Coaches active" value={stats.activeCoaches} icon={UserCog} />
        <StatCard
          label="Risk flags this week"
          value={stats.riskFlagsThisWeek}
          icon={ShieldAlert}
          tone={stats.riskFlagsThisWeek > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement by team</CardTitle>
            <CardDescription>Share of assigned tasks completed this week, per team.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionByTeamChart data={stats.engagementByTeam} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion trend</CardTitle>
            <CardDescription>School-wide weekly completion rate over the last 3 weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdherenceTrendChart data={stats.completionTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk flags</CardTitle>
          <CardDescription>Pain, high fatigue, and no-activity flags awaiting coach follow-up.</CardDescription>
        </CardHeader>
        <CardContent>
          {openRiskFlags.length === 0 ? (
            <EmptyState title="No open risk flags" description="Nothing needs attention right now." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Reported</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openRiskFlags.map((flag) => {
                  const player = getPlayerById(flag.playerId);
                  return (
                    <TableRow key={flag.id}>
                      <TableCell className="font-medium">{player?.fullName}</TableCell>
                      <TableCell>
                        <RiskBadge type={flag.type} />
                      </TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground">{flag.note}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(flag.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coach activity</CardTitle>
          <CardDescription>Who is using the platform across the school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coach</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Players</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coaches.map((coach) => {
                const teams = getTeamsForCoach(coach.id);
                const playerCount = getPlayersForCoach(coach.id).length;
                return (
                  <TableRow key={coach.id}>
                    <TableCell className="font-medium">{coach.fullName}</TableCell>
                    <TableCell>{teams.map((t) => t.name).join(", ") || "—"}</TableCell>
                    <TableCell>{playerCount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
