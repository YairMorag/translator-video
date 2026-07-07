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
          <p className="text-sm text-muted-foreground">{school.name} · שבוע {currentWeekLabel()}</p>
          <h1 className="text-2xl font-semibold tracking-tight">לוח בקרה של בית הספר</h1>
          <p className="mt-1 text-sm text-muted-foreground">האם בית הספר מפיק ערך מהמערכת?</p>
        </div>
        <Button asChild>
          <Link href="/admin/teams">צפייה בקבוצות</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="שחקנים פעילים" value={stats.totalActivePlayers} icon={Users2} />
        <StatCard label="קבוצות פעילות" value={stats.activeTeams} icon={ClipboardCheck} />
        <StatCard label="מעורבות שבועית" value={`${stats.weeklyEngagementRate}%`} icon={TrendingUp} tone="success" />
        <StatCard label="שיעור השלמה ממוצע" value={`${stats.averageCompletionRate}%`} icon={Percent} />
        <StatCard label="מאמנים פעילים" value={stats.activeCoaches} icon={UserCog} />
        <StatCard
          label="דגלי סיכון השבוע"
          value={stats.riskFlagsThisWeek}
          icon={ShieldAlert}
          tone={stats.riskFlagsThisWeek > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>מעורבות לפי קבוצה</CardTitle>
            <CardDescription>אחוז המשימות שהושלמו השבוע, לפי קבוצה.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionByTeamChart data={stats.engagementByTeam} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>מגמת השלמה</CardTitle>
            <CardDescription>שיעור השלמה שבועי ברמת בית הספר ב-3 השבועות האחרונים.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdherenceTrendChart data={stats.completionTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>דגלי סיכון</CardTitle>
          <CardDescription>דגלי כאב, עייפות גבוהה וחוסר פעילות הממתינים למעקב מאמן.</CardDescription>
        </CardHeader>
        <CardContent>
          {openRiskFlags.length === 0 ? (
            <EmptyState title="אין דגלי סיכון פתוחים" description="שום דבר לא דורש תשומת לב כרגע." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שחקן</TableHead>
                  <TableHead>דגל</TableHead>
                  <TableHead>פירוט</TableHead>
                  <TableHead>דווח</TableHead>
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
          <CardTitle>פעילות מאמנים</CardTitle>
          <CardDescription>מי משתמש בפלטפורמה ברחבי בית הספר.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מאמן</TableHead>
                <TableHead>קבוצות</TableHead>
                <TableHead>שחקנים</TableHead>
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
