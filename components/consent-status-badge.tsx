import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ConsentStatus } from "@/lib/types";

const CONFIG: Record<ConsentStatus, { label: string; variant: "success" | "warning" | "destructive"; icon: typeof CheckCircle2 }> = {
  approved: { label: "Consent approved", variant: "success", icon: CheckCircle2 },
  pending: { label: "Consent pending", variant: "warning", icon: Clock },
  revoked: { label: "Consent revoked", variant: "destructive", icon: XCircle },
};

export function ConsentStatusBadge({ status, className }: { status: ConsentStatus; className?: string }) {
  const { label, variant, icon: Icon } = CONFIG[status];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
