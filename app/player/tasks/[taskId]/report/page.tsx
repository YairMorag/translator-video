import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerReportForm } from "@/components/player-report-form";
import { getPlayerByProfileId, getAssignedTasksForPlayer, getTaskById } from "@/lib/data/store";

export default async function PlayerTaskReportPage({ params }: { params: Promise<{ taskId: string }> }) {
  const profile = await requireProfile("player");
  const { taskId } = await params;
  const player = getPlayerByProfileId(profile.id);
  if (!player) notFound();

  const task = getTaskById(taskId);
  if (!task) notFound();

  const assignedTask = getAssignedTasksForPlayer(player.id).find((a) => a.taskId === taskId);
  if (!assignedTask) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{task.title}</p>
        <h1 className="text-xl font-semibold">How did it go?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your answers help your coach adjust your training safely.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <PlayerReportForm assignedTaskId={assignedTask.id} taskId={task.id} />
        </CardContent>
      </Card>
    </div>
  );
}
