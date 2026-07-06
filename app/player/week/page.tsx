import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { TaskCard } from "@/components/task-card";
import { EmptyState } from "@/components/empty-state";
import { Progress } from "@/components/ui/progress";
import { getPlayerByProfileId, getWeeklyPlanForPlayer, getAssignedTasksForPlayer, getTaskById } from "@/lib/data/store";
import { getPlayerWeekProgress } from "@/lib/data/metrics";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import { currentWeekLabel } from "@/lib/date";

export default async function PlayerWeekPage() {
  const profile = await requireProfile("player");
  const player = getPlayerByProfileId(profile.id);
  if (!player) notFound();

  if (player.parentConsentStatus !== "approved") {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="נדרש אישור הורה"
        description="ההורה שלך צריך לאשר את האימון הביתי לפני שתוכל/י לראות את התוכנית השבועית שלך."
      />
    );
  }

  const plan = getWeeklyPlanForPlayer(player.id);
  const assignedTasks = getAssignedTasksForPlayer(player.id);
  const progress = getPlayerWeekProgress(player.id);
  const focusLabel = plan?.focusLabel ?? (plan ? CATEGORY_LABELS[plan.focusArea as keyof typeof CATEGORY_LABELS] : undefined);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">שבוע {currentWeekLabel()}</p>
        <h1 className="text-xl font-semibold">השבוע שלי</h1>
        {focusLabel && <p className="mt-1 text-sm text-muted-foreground">מיקוד: {focusLabel}</p>}
      </div>

      {assignedTasks.length === 0 ? (
        <EmptyState title="עדיין לא הוקצו משימות" description="המאמן שלך יפרסם את התוכנית השבועית בקרוב." />
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progress.completed} מתוך {progress.total} הושלמו</span>
              <span>{progress.rate}%</span>
            </div>
            <Progress value={progress.rate} />
          </div>
          <div className="space-y-3">
            {assignedTasks.map((assigned) => {
              const task = getTaskById(assigned.taskId);
              if (!task) return null;
              return <TaskCard key={assigned.id} task={task} status={assigned.status} href={`/player/tasks/${task.id}`} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
