import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const ROLE_LABELS: Record<Role, string> = {
  school_admin: "School Admin",
  coach: "Coach",
  parent: "Parent",
  player: "Player",
};

export function RoleBadge({
  role,
  variant = "dark",
  className,
}: {
  role: Role;
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        variant === "dark" ? "border-white/20 text-white" : "border-primary/20 text-primary",
        className
      )}
    >
      {ROLE_LABELS[role]}
    </Badge>
  );
}
