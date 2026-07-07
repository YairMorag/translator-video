"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { addCoachNoteAction, type NoteFormState } from "@/lib/actions/coach-actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CoachNoteForm({ playerId }: { playerId: string }) {
  const action = addCoachNoteAction.bind(null, playerId);
  const [state, formAction, pending] = useActionState<NoteFormState | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <Textarea name="note" placeholder="הוסיפו הערה על השחקן…" rows={3} required />
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" name="visibility" value="parent_visible" className="h-3.5 w-3.5" />
          שיתוף עם הורה
        </label>
        <Button type="submit" size="sm" disabled={pending}>
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          שמירת הערה
        </Button>
      </div>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
      {state?.success && <p className="text-xs text-success">ההערה נשמרה.</p>}
    </form>
  );
}
