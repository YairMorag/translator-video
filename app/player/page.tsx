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
        <h1 className="text-xl font-semibold">היי, {firstName}</h1>
        <EmptyState
          icon={ShieldAlert}
          title="נדרש אישור הורה"
          description="ההורה שלך צריך לאשר את האימון הביתי לפני שתוכל/י לראות את המשימות שלך. בקש/י ממנו לבדוק את חשבון NextPlay שלו."
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
        <h1 className="text-xl font-semibold">היי, {firstName}</h1>
        {focusLabel && <p className="mt-1 text-sm text-muted-foreground">השבוע: {focusLabel}</p>}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm text-muted-foreground">התקדמות שבועית</p>
            <p className="text-lg font-semibold">
              {progress.completed} מתוך {progress.total} משימות הושלמו
            </p>
          </div>
          <ProgressRing value={progress.rate} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">המשימה של היום</p>
        {nextTask && nextTaskCatalog ? (
          <>
            <TaskCard task={nextTaskCatalog} status={nextTask.status} href={`/player/tasks/${nextTaskCatalog.id}`} />
            <Button asChild size="lg" className="w-full">
              <Link href={`/player/tasks/${nextTaskCatalog.id}`}>התחלת משימה</Link>
            </Button>
          </>
        ) : assignedTasks.length === 0 ? (
          <EmptyState title="עדיין לא הוקצו משימות" description="המאמן שלך יפרסם את התוכנית השבועית בקרוב." />
        ) : (
          <Card className="border-success/40 bg-success-soft/30">
            <CardContent className="flex items-center gap-3 p-5">
              <Sparkles className="h-5 w-5 text-success" />
              <p className="text-sm font-medium">כל המשימות הושלמו השבוע. עבודה מעולה!</p>
            </CardContent>
          </Card>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href="/player/week">צפייה בשבוע</Link>
        </Button>
      </div>

      <Card className="bg-secondary/50">
        <CardContent className="space-y-2 p-5 text-sm">
          <p className="font-medium">עבודה קטנה בין האימונים יוצרת התקדמות גדולה.</p>
          <p className="text-muted-foreground">אם משהו כואב, תעצור/י ותדווח/י על זה.</p>
        </CardContent>
      </Card>
    </div>
  );
}
