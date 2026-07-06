import { AlertTriangle, BatteryLow, CalendarX, MessageCircleWarning } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RiskType } from "@/lib/types";

const CONFIG: Record<
  RiskType,
  { label: string; variant: "destructive" | "warning" | "muted" | "primary"; icon: typeof AlertTriangle }
> = {
  pain: { label: "Pain reported", variant: "destructive", icon: AlertTriangle },
  high_fatigue: { label: "High fatigue", variant: "warning", icon: BatteryLow },
  no_activity: { label: "No activity", variant: "muted", icon: CalendarX },
  coach_review: { label: "Needs review", variant: "primary", icon: MessageCircleWarning },
};

export function RiskBadge({ type, className }: { type: RiskType; className?: string }) {
  const { label, variant, icon: Icon } = CONFIG[type];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
