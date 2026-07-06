import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { CompletionByTeamChart, AdherenceTrendChart } from "@/components/charts/dashboard-charts";
import { Users2, ClipboardCheck, HeartHandshake } from "lucide-react";
import { getSchool } from "@/lib/data/store";
import { computeAdminDashboardStats } from "@/lib/data/metrics";

export default function AdminReportsPage() {
  const school = getSchool();
  const stats = computeAdminDashboardStats(school.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">School Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A pilot-readiness snapshot you can share with school leadership.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Weekly engagement" value={`${stats.weeklyEngagementRate}%`} icon={Users2} tone="success" />
        <StatCard label="Average completion" value={`${stats.averageCompletionRate}%`} icon={ClipboardCheck} />
        <StatCard label="Parent consent completed" value={`${stats.parentConsentRate}%`} icon={HeartHandshake} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement by team</CardTitle>
            <CardDescription>Completion rate per team this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionByTeamChart data={stats.engagementByTeam} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3-week completion trend</CardTitle>
            <CardDescription>Whether the pilot is generating sustained engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdherenceTrendChart data={stats.completionTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parent consent completion</CardTitle>
          <CardDescription>
            {stats.parentConsentRate}% of players have completed parental consent. Players without consent
            cannot see or perform home-training tasks.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
