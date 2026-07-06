import { ShieldCheck } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { approveConsentAction } from "@/lib/actions/parent-actions";
import { getPlayersForParent, getTeamById } from "@/lib/data/store";
import { POSITION_LABELS } from "@/lib/labels";

export default async function ParentConsentPage() {
  const profile = await requireProfile("parent");
  const children = getPlayersForParent(profile.id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">אישור הורה</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          משימות מוצגות לילד/ה שלכם רק לאחר שתאשרו השתתפות באימון ביתי.
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
                <CardDescription>{team?.name} · {POSITION_LABELS[child.position]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  באישורכם, אתם מאשרים כי הילד/ה שלכם רשאי/ת לבצע משימות אימון ביתי מותאמות גיל
                  שאושרו על ידי המאמן. הילד/ה שלכם יכול/ה לדווח על כאב או עייפות בכל עת, והאימון
                  נעצר אוטומטית בכל פעם שמדווח כאב.
                </p>
                {child.parentConsentStatus !== "approved" && (
                  <form action={approveConsentAction.bind(null, child.id)}>
                    <Button type="submit">
                      <ShieldCheck className="h-4 w-4" /> אישור אימון ביתי
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
