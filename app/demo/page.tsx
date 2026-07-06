import Link from "next/link";
import { Building2, ClipboardList, HeartHandshake, Footprints, ShieldCheck } from "lucide-react";

import { loginAsDemoRole } from "@/lib/auth/actions";
import { DEMO_ACCOUNTS } from "@/lib/auth/demo-accounts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";
import type { Role } from "@/lib/types";

const ICONS: Record<Role, React.ComponentType<{ className?: string }>> = {
  school_admin: Building2,
  coach: ClipboardList,
  parent: HeartHandshake,
  player: Footprints,
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-lg font-semibold">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            See the platform from every point of view
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Pick a role below to jump straight into a live, seeded demo of North Valley Football
            Academy — no account setup required.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = ICONS[account.role];
            return (
              <Card key={account.role} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{account.label}</CardTitle>
                  <CardDescription>{account.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={loginAsDemoRole.bind(null, account.email)}>
                    <Button type="submit" className="w-full">
                      Continue as {account.name.split(" ")[0]}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Prefer the sign-in form?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Go to login
          </Link>
        </p>
      </div>
    </div>
  );
}
