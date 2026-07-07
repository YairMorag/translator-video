import { notFound } from "next/navigation";
import { CheckCircle2, Flame } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/progress-ring";
import { EmptyState } from "@/components/empty-state";
import { getPlayerByProfileId, getAllAssignedTasksForPlayer, getTaskReportsForPlayer } from "@/lib/data/store";
import { getPlayerWeekProgress } from "@/lib/data/metrics";
import { formatDate } from "@/lib/date";

export default async function PlayerProgressPage() {
  const profile = await requireProfile("player");
  const player = getPlayerByProfileId(profile.id);
  if (!player) notFound();

  const progress = getPlayerWeekProgress(player.id);
  const allTasks = getAllAssignedTasksForPlayer(player.id);
  const totalCompleted = allTasks.filter((t) => t.status === "completed").length;
  const reports = getTaskReportsForPlayer(player.id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">ההתקדמות שלי</h1>
        <p className="mt-1 text-sm text-muted-foreground">עקביות בין האימונים היא איך ששחקנים משתפרים.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-5">
            <ProgressRing value={progress.rate} label="השבוע" />
            <p className="text-xs text-muted-foreground">{progress.completed}/{progress.total || 0} משימות</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Flame className="h-6 w-6" />
            </div>
            <p className="text-2xl font-semibold">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground">משימות שהושלמו בסך הכול</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">פעילות אחרונה</p>
        {reports.length === 0 ? (
          <EmptyState title="אין פעילות עדיין" description="השלימו משימה ודווחו איך היא הלכה כדי לראות את ההתקדמות שלכם כאן." />
        ) : (
          reports.slice(0, 8).map((report) => (
            <Card key={report.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">קושי {report.difficulty}/5 · עייפות {report.fatigue}/5</p>
                    <p className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
