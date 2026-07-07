import Link from "next/link";
import { Users2, ClipboardCheck, AlertTriangle, Activity, BatteryLow, CalendarX } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { StatCard } from "@/components/stat-card";
import { PlayerCard } from "@/components/player-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { CompletionByTeamChart, CategoryDistributionChart } from "@/components/charts/dashboard-charts";
import { getTeamsForCoach, getTaskReportsForPlayer, getPlayerById, getTaskById, getAssignedTaskById } from "@/lib/data/store";
import { computeCoachDashboardStats } from "@/lib/data/metrics";
import { currentWeekLabel, formatDateTime } from "@/lib/date";

export default async function CoachDashboardPage() {
  const profile = await requireProfile("coach");
  const stats = computeCoachDashboardStats(profile.id);
  const teams = getTeamsForCoach(profile.id);
  const attentionRows = stats.playerRows.filter((r) => r.needsAttention);

  const recentReports = stats.playerRows
    .flatMap((row) => getTaskReportsForPlayer(row.player.id).slice(0, 1))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">שבוע {currentWeekLabel()}</p>
          <h1 className="text-2xl font-semibold tracking-tight">לוח הבקרה של המאמן</h1>
          <p className="mt-1 text-sm text-muted-foreground">מי דורש את תשומת לבי?</p>
        </div>
        <Button asChild>
          <Link href="/coach/assign">הקצאת משימות שבועיות</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="שחקנים פעילים" value={stats.activePlayers} icon={Users2} />
        <StatCard label="השלמה שבועית" value={`${stats.weeklyCompletionRate}%`} icon={ClipboardCheck} tone="success" />
        <StatCard
          label="דורשים תשומת לב"
          value={stats.playersNeedingAttention}
          icon={AlertTriangle}
          tone={stats.playersNeedingAttention > 0 ? "warning" : "default"}
        />
        <StatCard label="דיווחי כאב" value={stats.painReports} icon={Activity} tone={stats.painReports > 0 ? "destructive" : "default"} />
        <StatCard label="עייפות גבוהה" value={stats.highFatigueReports} icon={BatteryLow} tone={stats.highFatigueReports > 0 ? "warning" : "default"} />
        <StatCard label="אין פעילות עדיין" value={stats.noActivityPlayers} icon={CalendarX} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת תשומת הלב של היום</CardTitle>
          <CardDescription>
            {attentionRows.length > 0
              ? attentionRows.length === 1
                ? "שחקן אחד דורש את תשומת לבך השבוע."
                : `${attentionRows.length} שחקנים דורשים את תשומת לבך השבוע.`
              : "אין שחקנים שדורשים תשומת לב כרגע."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attentionRows.length === 0 ? (
            <EmptyState title="הכול תקין" description="אין דגלי כאב, עייפות גבוהה או חוסר פעילות כרגע." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {attentionRows.map((row) => (
                <PlayerCard key={row.player.id} row={row} href={`/coach/players/${row.player.id}`} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>הקבוצות שלי</CardTitle>
            <CardDescription>שיעור השלמה לפי קבוצה השבוע.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompletionByTeamChart data={stats.completionByTeam} />
            <div className="grid gap-2 sm:grid-cols-3">
              {teams.map((team) => (
                <Link key={team.id} href={`/coach/teams/${team.id}`}>
                  <Card className="hover:border-accent/40">
                    <CardContent className="p-4">
                      <p className="font-semibold">{team.name}</p>
                      <p className="text-xs text-muted-foreground">{team.ageGroup}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>התפלגות קטגוריות משימות</CardTitle>
            <CardDescription>במה מתמקדות המשימות שהוקצו השבוע.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.categoryDistribution.length === 0 ? (
              <EmptyState title="טרם הוקצו משימות" />
            ) : (
              <CategoryDistributionChart data={stats.categoryDistribution} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>דוחות אחרונים</CardTitle>
          <CardDescription>דוחות ההשלמה האחרונים של השחקנים שלך.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <EmptyState title="אין דוחות עדיין" description="דוחות יופיעו כאן לאחר שהשחקנים ישלימו משימות." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שחקן</TableHead>
                  <TableHead>משימה</TableHead>
                  <TableHead>קושי</TableHead>
                  <TableHead>עייפות</TableHead>
                  <TableHead>כאב</TableHead>
                  <TableHead>מתי</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => {
                  const player = getPlayerById(report.playerId);
                  const assignedTask = getAssignedTaskById(report.assignedTaskId);
                  const taskTitle = assignedTask ? getTaskById(assignedTask.taskId)?.title : undefined;
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <Link href={`/coach/players/${report.playerId}`} className="hover:text-accent hover:underline">
                          {player?.fullName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{taskTitle ?? "משימת בית"}</TableCell>
                      <TableCell>{report.difficulty}/5</TableCell>
                      <TableCell>
                        <Badge variant={report.fatigue >= 4 ? "warning" : "muted"}>{report.fatigue}/5</Badge>
                      </TableCell>
                      <TableCell>
                        {report.painReported ? <Badge variant="destructive">כן</Badge> : <span className="text-xs text-muted-foreground">לא</span>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(report.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
