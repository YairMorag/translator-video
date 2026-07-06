import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function CoachApprovedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={className}>
      <BadgeCheck className="h-3.5 w-3.5" />
      Coach approved
    </Badge>
  );
}
