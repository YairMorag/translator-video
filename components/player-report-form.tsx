"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { submitTaskReportAction, type ReportFormState } from "@/lib/actions/player-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SCALE = [1, 2, 3, 4, 5];

function YesNoToggle({ name, defaultValue = "no" }: { name: string; defaultValue?: "yes" | "no" }) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label={name}>
      {(["yes", "no"] as const).map((v) => (
        <label
          key={v}
          className={cn(
            "flex-1 cursor-pointer rounded-md border border-input px-4 py-2 text-center text-sm font-medium transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
          )}
        >
          <input
            type="radio"
            name={name}
            value={v}
            defaultChecked={v === defaultValue}
            className="sr-only"
            required
          />
          {v === "yes" ? "כן" : "לא"}
        </label>
      ))}
    </div>
  );
}

function ScalePicker({ name, label }: { name: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {SCALE.map((n) => (
          <label
            key={n}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md border border-input text-sm font-medium transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
          >
            <input type="radio" name={name} value={n} defaultChecked={n === 3} className="sr-only" required />
            {n}
          </label>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>קל / רענן</span>
        <span>קשה מאוד / מותש</span>
      </div>
    </div>
  );
}

export function PlayerReportForm({ assignedTaskId, taskId }: { assignedTaskId: string; taskId: string }) {
  const router = useRouter();
  const action = submitTaskReportAction.bind(null, assignedTaskId, taskId);
  const [state, formAction, pending] = useActionState<ReportFormState | undefined, FormData>(action, undefined);

  if (state?.success) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-surface p-5 text-center">
        {state.painReported ? (
          <>
            <p className="text-base font-semibold text-destructive">
              תודה על הדיווח. עצור/י את האימון לעת עתה.
            </p>
            <p className="text-sm text-muted-foreground">המאמן שלך יבדוק את זה לפני המשימה הבאה שלך.</p>
          </>
        ) : state.highFatigue ? (
          <>
            <p className="text-base font-semibold text-warning">דיווחת על עייפות גבוהה.</p>
            <p className="text-sm text-muted-foreground">
              התאוששות היא חלק מהאימון. המאמן שלך יראה את הדיווח הזה.
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-success">כל הכבוד!</p>
            <p className="text-sm text-muted-foreground">
              עקביות בין האימונים היא איך ששחקנים משתפרים. המאמן שלך משתמש בדיווח הזה כדי להתאים את האימון שלך.
            </p>
          </>
        )}
        <Button onClick={() => router.push("/player")} className="w-full">
          חזרה להיום
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-1.5">
        <Label>השלמת את המשימה?</Label>
        <YesNoToggle name="completed" defaultValue="yes" />
      </div>

      <ScalePicker name="difficulty" label="כמה קשה זה הרגיש? (1-5)" />
      <ScalePicker name="fatigue" label="כמה עייף/ה את/ה מרגיש/ה? (1-5)" />

      <div className="space-y-1.5">
        <Label>יש כאב?</Label>
        <YesNoToggle name="pain" defaultValue="no" />
        <p className="text-xs text-muted-foreground">
          אם משהו כאב במהלך המשימה, אנא בחר/י כן — המאמן שלך יחזור אליך לפני המשימה הבאה.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">הערה (לא חובה)</Label>
        <Textarea id="note" name="note" placeholder="משהו שתרצה/י שהמאמן ידע?" rows={3} />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        שליחת דיווח
      </Button>
    </form>
  );
}
