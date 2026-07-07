import { AlertTriangle, BatteryLow, CalendarX, MessageCircleWarning } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { RISK_TYPE_LABELS } from "@/lib/labels";
import type { RiskType } from "@/lib/types";

const CONFIG: Record<
  RiskType,
  { variant: "destructive" | "warning" | "muted" | "primary"; icon: typeof AlertTriangle }
> = {
  pain: { variant: "destructive", icon: AlertTriangle },
  high_fatigue: { variant: "warning", icon: BatteryLow },
  no_activity: { variant: "muted", icon: CalendarX },
  coach_review: { variant: "primary", icon: MessageCircleWarning },
};

export function RiskBadge({ type, className }: { type: RiskType; className?: string }) {
  const { variant, icon: Icon } = CONFIG[type];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {RISK_TYPE_LABELS[type]}
    </Badge>
  );
}
