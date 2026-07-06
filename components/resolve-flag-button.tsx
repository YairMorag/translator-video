"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

import { resolveRiskFlagAction } from "@/lib/actions/coach-actions";
import { Button } from "@/components/ui/button";

export function ResolveFlagButton({ riskFlagId, playerId }: { riskFlagId: string; playerId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(() => resolveRiskFlagAction(riskFlagId, playerId))}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      סימון כנבדק
    </Button>
  );
}
