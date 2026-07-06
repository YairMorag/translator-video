"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth/session";
import { getAssignedTaskById, getPlayerById, startAssignedTask, submitTaskReport } from "@/lib/data/store";
import { taskReportSchema } from "@/lib/validation/report-schema";

export interface ReportFormState {
  error?: string;
  success?: boolean;
  painReported?: boolean;
  highFatigue?: boolean;
}

export async function startTask(assignedTaskId: string) {
  const profile = await requireProfile("player");
  const task = getAssignedTaskById(assignedTaskId);
  const player = task ? getPlayerById(task.playerId) : undefined;
  if (!task || !player || player.profileId !== profile.id) {
    throw new Error("Task not found");
  }
  startAssignedTask(assignedTaskId);
  revalidatePath(`/player/tasks/${task.taskId}`);
}

export async function submitTaskReportAction(
  assignedTaskId: string,
  taskId: string,
  _prevState: ReportFormState | undefined,
  formData: FormData
): Promise<ReportFormState> {
  const profile = await requireProfile("player");
  const assignedTask = getAssignedTaskById(assignedTaskId);
  const player = assignedTask ? getPlayerById(assignedTask.playerId) : undefined;
  if (!assignedTask || !player || player.profileId !== profile.id) {
    return { error: "We couldn't find that task." };
  }

  const parsed = taskReportSchema.safeParse({
    completed: formData.get("completed"),
    difficulty: formData.get("difficulty"),
    fatigue: formData.get("fatigue"),
    pain: formData.get("pain"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: "Please check your answers and try again." };
  }

  const { report } = submitTaskReport(assignedTaskId, {
    completed: parsed.data.completed === "yes",
    difficulty: parsed.data.difficulty,
    fatigue: parsed.data.fatigue,
    painReported: parsed.data.pain === "yes",
    note: parsed.data.note,
  });

  revalidatePath("/player");
  revalidatePath("/player/week");
  revalidatePath(`/player/tasks/${taskId}`);
  revalidatePath("/coach");
  revalidatePath("/admin");
  revalidatePath("/parent");

  return {
    success: true,
    painReported: report.painReported,
    highFatigue: report.fatigue >= 4,
  };
}

export async function goToPlayerHome() {
  await requireProfile("player");
  redirect("/player");
}
