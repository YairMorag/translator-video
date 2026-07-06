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
        title="Parent approval needed"
        description="Your parent needs to approve home training before you can see your weekly plan."
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
        <p className="text-sm text-muted-foreground">Week of {currentWeekLabel()}</p>
        <h1 className="text-xl font-semibold">My Week</h1>
        {focusLabel && <p className="mt-1 text-sm text-muted-foreground">Focus: {focusLabel}</p>}
      </div>

      {assignedTasks.length === 0 ? (
        <EmptyState title="No tasks assigned yet" description="Your coach will publish this week's plan soon." />
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progress.completed} of {progress.total} completed</span>
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
