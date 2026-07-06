import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RiskBadge } from "@/components/risk-badge";
import { Progress } from "@/components/ui/progress";
import type { PlayerRow } from "@/lib/data/metrics";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PlayerCard({ row, href }: { row: PlayerRow; href: string }) {
  const { player, progress, openFlags } = row;
  return (
    <Link href={href} className="block">
      <Card className="hover:border-accent/40">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(player.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{player.fullName}</p>
              <p className="text-xs capitalize text-muted-foreground">{player.position}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>This week</span>
              <span>
                {progress.completed}/{progress.total || 0} tasks
              </span>
            </div>
            <Progress value={progress.rate} />
          </div>

          {openFlags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {openFlags.map((flag) => (
                <RiskBadge key={flag.id} type={flag.type} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
