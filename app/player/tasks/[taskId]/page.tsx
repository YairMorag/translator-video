import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Dumbbell, ShieldAlert, CheckCircle2, PlayCircle } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoachApprovedBadge } from "@/components/coach-approved-badge";
import { EmptyState } from "@/components/empty-state";
import { startTask } from "@/lib/actions/player-actions";
import {
  getPlayerByProfileId,
  getAssignedTasksForPlayer,
  getTaskById,
  getReportForAssignedTask,
} from "@/lib/data/store";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";

export default async function PlayerTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const profile = await requireProfile("player");
  const { taskId } = await params;
  const player = getPlayerByProfileId(profile.id);
  if (!player) notFound();

  if (player.parentConsentStatus !== "approved") {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Parent approval needed"
        description="Your parent needs to approve home training before you can see this task."
      />
    );
  }

  const task = getTaskById(taskId);
  if (!task) notFound();

  const assignedTask = getAssignedTasksForPlayer(player.id).find((a) => a.taskId === taskId);
  if (!assignedTask) notFound();

  const report = assignedTask.status === "completed" ? getReportForAssignedTask(assignedTask.id) : undefined;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{CATEGORY_LABELS[task.category]}</p>
        <h1 className="text-xl font-semibold">{task.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline"><Clock className="h-3.5 w-3.5" /> {task.durationMinutes} min</Badge>
          <Badge variant="outline" className="capitalize">{task.intensity} intensity</Badge>
          <Badge variant="outline"><Dumbbell className="h-3.5 w-3.5" /> {task.equipmentNeeded}</Badge>
          <CoachApprovedBadge />
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold">Why this matters</p>
            <p className="mt-1 text-sm text-muted-foreground">{task.whyItMatters}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Steps</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              {task.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-md bg-warning-soft px-3 py-2 text-sm text-warning">{task.safetyNotes}</div>
          <div className="flex items-center justify-center rounded-md border border-dashed border-border py-6 text-sm text-muted-foreground">
            Video demonstration coming soon
          </div>
        </CardContent>
      </Card>

      {assignedTask.status === "completed" ? (
        <Card className="border-success/40 bg-success-soft/30">
          <CardContent className="space-y-2 p-5">
            <p className="flex items-center gap-2 font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Task completed
            </p>
            {report && (
              <p className="text-sm text-muted-foreground">
                You reported difficulty {report.difficulty}/5 and fatigue {report.fatigue}/5.
                {report.painReported && " Pain was reported — your coach was notified."}
              </p>
            )}
          </CardContent>
        </Card>
      ) : assignedTask.status === "assigned" ? (
        <form action={startTask.bind(null, assignedTask.id)}>
          <Button type="submit" size="lg" className="w-full">
            <PlayCircle className="h-4 w-4" /> Start Task
          </Button>
        </form>
      ) : (
        <Button asChild size="lg" className="w-full">
          <Link href={`/player/tasks/${task.id}/report`}>Mark as complete</Link>
        </Button>
      )}
    </div>
  );
}
