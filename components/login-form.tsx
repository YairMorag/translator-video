"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { loginWithEmail } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginWithEmail, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" placeholder="coach@nextplay.demo" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" />
        <p className="text-xs text-muted-foreground">
          מצב הדגמה: כל סיסמה עובדת עם אימייל של חשבון הדגמה.
        </p>
      </div>
      {state?.error && (
        <p className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        התחברות
      </Button>
    </form>
  );
}
