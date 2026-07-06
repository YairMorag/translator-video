"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { submitParentConcernAction, type ConcernFormState } from "@/lib/actions/parent-actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ParentConcernForm({ playerId }: { playerId: string }) {
  const action = submitParentConcernAction.bind(null, playerId);
  const [state, formAction, pending] = useActionState<ConcernFormState | undefined, FormData>(action, undefined);

  if (state?.success) {
    return <p className="text-sm text-success">Thanks — your coach has received your note.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <Textarea name="note" placeholder="Share a concern or question with the coach…" rows={3} required />
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending}>
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Send to coach
      </Button>
    </form>
  );
}
