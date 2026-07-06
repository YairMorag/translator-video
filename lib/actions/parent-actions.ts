"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth/session";
import { submitParentConcern as storeSubmitParentConcern, setConsentStatus, getPlayersForParent } from "@/lib/data/store";

export interface ConcernFormState {
  error?: string;
  success?: boolean;
}

export async function submitParentConcernAction(
  playerId: string,
  _prevState: ConcernFormState | undefined,
  formData: FormData
): Promise<ConcernFormState> {
  const profile = await requireProfile("parent");
  const players = getPlayersForParent(profile.id);
  if (!players.some((p) => p.id === playerId)) {
    return { error: "You don't have access to this player." };
  }

  const note = String(formData.get("note") ?? "").trim();
  if (!note) {
    return { error: "Please describe your concern before sending." };
  }

  storeSubmitParentConcern(profile.id, playerId, note);
  revalidatePath(`/parent/child/${playerId}`);
  return { success: true };
}

export async function approveConsentAction(playerId: string) {
  const profile = await requireProfile("parent");
  const players = getPlayersForParent(profile.id);
  if (!players.some((p) => p.id === playerId)) return;
  setConsentStatus(playerId, "approved");
  revalidatePath("/parent");
  revalidatePath("/parent/consent");
  revalidatePath(`/parent/child/${playerId}`);
  revalidatePath("/player");
}
