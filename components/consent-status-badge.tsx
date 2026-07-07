import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CONSENT_STATUS_LABELS } from "@/lib/labels";
import type { ConsentStatus } from "@/lib/types";

const CONFIG: Record<ConsentStatus, { variant: "success" | "warning" | "destructive"; icon: typeof CheckCircle2 }> = {
  approved: { variant: "success", icon: CheckCircle2 },
  pending: { variant: "warning", icon: Clock },
  revoked: { variant: "destructive", icon: XCircle },
};

export function ConsentStatusBadge({ status, className }: { status: ConsentStatus; className?: string }) {
  const { variant, icon: Icon } = CONFIG[status];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {CONSENT_STATUS_LABELS[status]}
    </Badge>
  );
}
