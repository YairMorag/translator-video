import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/progress-ring";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { getPlayersForParent, getTeamById, getOpenRiskFlagsForPlayer } from "@/lib/data/store";
import { getPlayerWeekProgress } from "@/lib/data/metrics";

export default async function ParentHomePage() {
  const profile = await requireProfile("parent");
  const children = getPlayersForParent(profile.id);

  const anyPain = children.some((c) => getOpenRiskFlagsForPlayer(c.id).some((f) => f.type === "pain"));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {profile.fullName.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasks are coach-approved and designed for short, safe practice at home.
        </p>
      </div>

      {anyPain && (
        <Card className="border-destructive/40 bg-destructive-soft/40">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p>
              Your child reported pain. The coach has been notified. Please avoid additional training until reviewed.
            </p>
          </CardContent>
        </Card>
      )}

      {children.length === 0 ? (
        <EmptyState title="No linked players yet" description="Contact your football school to link your child's account." />
      ) : (
        <div className="space-y-3">
          {children.map((child) => {
            const team = getTeamById(child.teamId);
            const progress = getPlayerWeekProgress(child.id);
            const flags = getOpenRiskFlagsForPlayer(child.id);
            return (
              <Link key={child.id} href={`/parent/child/${child.id}`}>
                <Card className="hover:border-accent/40">
                  <CardContent className="flex items-center gap-4 p-5">
                    <ProgressRing value={progress.rate} size={56} strokeWidth={6} />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-semibold">{child.fullName}</p>
                      <p className="text-xs text-muted-foreground">{team?.name} · {child.position}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <ConsentStatusBadge status={child.parentConsentStatus} />
                        {flags.map((f) => (
                          <RiskBadge key={f.id} type={f.type} />
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
