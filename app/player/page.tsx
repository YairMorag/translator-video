import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldAlert, Sparkles } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/progress-ring";
import { TaskCard } from "@/components/task-card";
import { EmptyState } from "@/components/empty-state";
import { getPlayerByProfileId, getWeeklyPlanForPlayer, getAssignedTasksForPlayer, getTaskById } from "@/lib/data/store";
import { getPlayerWeekProgress } from "@/lib/data/metrics";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";

export default async function PlayerHomePage() {
  const profile = await requireProfile("player");
  const player = getPlayerByProfileId(profile.id);
  if (!player) notFound();

  const firstName = player.fullName.split(" ")[0];

  if (player.parentConsentStatus !== "approved") {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8">
        <h1 className="text-xl font-semibold">Hi, {firstName}</h1>
        <EmptyState
          icon={ShieldAlert}
          title="Parent approval needed"
          description="Your parent needs to approve home training before you can see your tasks. Ask them to check their NextPlay account."
        />
      </div>
    );
  }

  const plan = getWeeklyPlanForPlayer(player.id);
  const assignedTasks = getAssignedTasksForPlayer(player.id);
  const progress = getPlayerWeekProgress(player.id);
  const nextTask = assignedTasks.find((t) => t.status === "assigned" || t.status === "started");
  const nextTaskCatalog = nextTask ? getTaskById(nextTask.taskId) : undefined;

  const focusLabel = plan?.focusLabel ?? (plan ? CATEGORY_LABELS[plan.focusArea as keyof typeof CATEGORY_LABELS] : undefined);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Hi, {firstName}</h1>
        {focusLabel && <p className="mt-1 text-sm text-muted-foreground">This week: {focusLabel}</p>}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm text-muted-foreground">Weekly progress</p>
            <p className="text-lg font-semibold">
              {progress.completed} of {progress.total} tasks completed
            </p>
          </div>
          <ProgressRing value={progress.rate} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Today&apos;s task</p>
        {nextTask && nextTaskCatalog ? (
          <>
            <TaskCard task={nextTaskCatalog} status={nextTask.status} href={`/player/tasks/${nextTaskCatalog.id}`} />
            <Button asChild size="lg" className="w-full">
              <Link href={`/player/tasks/${nextTaskCatalog.id}`}>Start Task</Link>
            </Button>
          </>
        ) : assignedTasks.length === 0 ? (
          <EmptyState title="No tasks assigned yet" description="Your coach will publish this week's plan soon." />
        ) : (
          <Card className="border-success/40 bg-success-soft/30">
            <CardContent className="flex items-center gap-3 p-5">
              <Sparkles className="h-5 w-5 text-success" />
              <p className="text-sm font-medium">All tasks completed for this week. Great work!</p>
            </CardContent>
          </Card>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href="/player/week">View Week</Link>
        </Button>
      </div>

      <Card className="bg-secondary/50">
        <CardContent className="space-y-2 p-5 text-sm">
          <p className="font-medium">Small work between sessions creates big progress.</p>
          <p className="text-muted-foreground">If something hurts, stop and report it.</p>
        </CardContent>
      </Card>
    </div>
  );
}
