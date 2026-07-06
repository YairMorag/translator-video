"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/session";
import {
  addCoachNote as storeAddCoachNote,
  resolveRiskFlag as storeResolveRiskFlag,
  createApprovedWeeklyPlan,
  getPlayerById,
} from "@/lib/data/store";
import type { NoteVisibility } from "@/lib/types";

export interface NoteFormState {
  error?: string;
  success?: boolean;
}

export async function addCoachNoteAction(
  playerId: string,
  _prevState: NoteFormState | undefined,
  formData: FormData
): Promise<NoteFormState> {
  const profile = await requireProfile("coach");
  const note = String(formData.get("note") ?? "").trim();
  const visibility = (formData.get("visibility") as NoteVisibility) ?? "private";

  if (!note) {
    return { error: "Please write a note before saving." };
  }

  storeAddCoachNote(profile.id, playerId, note, visibility);
  revalidatePath(`/coach/players/${playerId}`);
  revalidatePath("/parent");
  return { success: true };
}

export async function resolveRiskFlagAction(riskFlagId: string, playerId: string) {
  await requireProfile("coach");
  storeResolveRiskFlag(riskFlagId);
  revalidatePath(`/coach/players/${playerId}`);
  revalidatePath("/coach");
  revalidatePath("/admin");
}

export interface AssignFormState {
  error?: string;
  success?: boolean;
}

export async function approveWeeklyPlanAction(
  playerId: string,
  focusArea: string,
  focusLabel: string | undefined,
  taskIds: string[]
): Promise<AssignFormState> {
  const profile = await requireProfile("coach");
  const player = getPlayerById(playerId);
  if (!player) return { error: "Player not found." };
  if (player.parentConsentStatus !== "approved") {
    return { error: "This player does not have approved parental consent yet." };
  }
  if (taskIds.length === 0) {
    return { error: "Select at least one task before approving the plan." };
  }

  createApprovedWeeklyPlan({
    playerId,
    coachId: profile.id,
    focusArea,
    focusLabel,
    taskIds,
  });

  revalidatePath("/coach");
  revalidatePath(`/coach/players/${playerId}`);
  revalidatePath("/player");
  revalidatePath("/player/week");
  revalidatePath("/parent");
  return { success: true };
}
