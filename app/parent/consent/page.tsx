import { ShieldCheck } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { approveConsentAction } from "@/lib/actions/parent-actions";
import { getPlayersForParent, getTeamById } from "@/lib/data/store";

export default async function ParentConsentPage() {
  const profile = await requireProfile("parent");
  const children = getPlayersForParent(profile.id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Consent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasks are only shown to your child after you approve home-training participation.
        </p>
      </div>

      <div className="space-y-3">
        {children.map((child) => {
          const team = getTeamById(child.teamId);
          return (
            <Card key={child.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{child.fullName}</CardTitle>
                  <ConsentStatusBadge status={child.parentConsentStatus} />
                </div>
                <CardDescription>{team?.name} · {child.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  By approving, you confirm your child may perform coach-approved, age-appropriate home-training
                  tasks. Your child can report pain or fatigue at any time, and training pauses automatically
                  whenever pain is reported.
                </p>
                {child.parentConsentStatus !== "approved" && (
                  <form action={approveConsentAction.bind(null, child.id)}>
                    <Button type="submit">
                      <ShieldCheck className="h-4 w-4" /> Approve home training
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
