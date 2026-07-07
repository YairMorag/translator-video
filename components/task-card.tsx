import Link from "next/link";
import { Clock, Dumbbell, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachApprovedBadge } from "@/components/coach-approved-badge";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import { INTENSITY_LABELS, ASSIGNED_TASK_STATUS_LABELS } from "@/lib/labels";
import type { AssignedTaskStatus, Intensity, TaskCatalogItem } from "@/lib/types";

const INTENSITY_VARIANT: Record<Intensity, "success" | "warning" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
};

export function TaskCard({
  task,
  status,
  href,
}: {
  task: TaskCatalogItem;
  status: AssignedTaskStatus;
  href: string;
}) {
  const completed = status === "completed";
  return (
    <Link href={href} className="block">
      <Card className={completed ? "border-success/40 bg-success-soft/30" : "hover:border-accent/40"}>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {CATEGORY_LABELS[task.category]}
              </p>
              <h3 className="text-base font-semibold">{task.title}</h3>
            </div>
            {completed && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {task.durationMinutes} דקות
            </span>
            <Badge variant={INTENSITY_VARIANT[task.intensity]}>
              עצימות {INTENSITY_LABELS[task.intensity]}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5" /> {task.equipmentNeeded}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <CoachApprovedBadge />
            <span className="text-xs font-medium text-muted-foreground">
              {ASSIGNED_TASK_STATUS_LABELS[status]}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
