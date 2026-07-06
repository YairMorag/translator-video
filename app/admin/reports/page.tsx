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
        <h1 className="text-2xl font-semibold tracking-tight">דוחות בית ספר</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          תמונת מצב על מוכנות הפיילוט, לשיתוף עם הנהלת בית הספר.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="מעורבות שבועית" value={`${stats.weeklyEngagementRate}%`} icon={Users2} tone="success" />
        <StatCard label="השלמה ממוצעת" value={`${stats.averageCompletionRate}%`} icon={ClipboardCheck} />
        <StatCard label="השלמת אישור הורה" value={`${stats.parentConsentRate}%`} icon={HeartHandshake} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>מעורבות לפי קבוצה</CardTitle>
            <CardDescription>שיעור השלמה לכל קבוצה השבוע.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionByTeamChart data={stats.engagementByTeam} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>מגמת השלמה תלת-שבועית</CardTitle>
            <CardDescription>האם הפיילוט מייצר מעורבות עקבית.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdherenceTrendChart data={stats.completionTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>השלמת אישור הורה</CardTitle>
          <CardDescription>
            {stats.parentConsentRate}% מהשחקנים השלימו אישור הורה. שחקנים ללא אישור אינם יכולים
            לראות או לבצע משימות אימון ביתי.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
