import Link from "next/link";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "@/components/risk-badge";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { Badge } from "@/components/ui/badge";
import { POSITION_LABELS } from "@/lib/labels";
import type { PlayerRow } from "@/lib/data/metrics";

export function TeamRosterTable({ rows, playerHref }: { rows: PlayerRow[]; playerHref?: (playerId: string) => string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>שחקן</TableHead>
          <TableHead>עמדה</TableHead>
          <TableHead>השבוע</TableHead>
          <TableHead>עייפות</TableHead>
          <TableHead>אישור הורה</TableHead>
          <TableHead>דגלים</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const name = playerHref ? (
            <Link href={playerHref(row.player.id)} className="font-medium hover:text-accent hover:underline">
              {row.player.fullName}
            </Link>
          ) : (
            <span className="font-medium">{row.player.fullName}</span>
          );
          return (
            <TableRow key={row.player.id}>
              <TableCell>{name}</TableCell>
              <TableCell className="text-muted-foreground">{POSITION_LABELS[row.player.position]}</TableCell>
              <TableCell>
                {row.progress.total === 0 ? (
                  <span className="text-xs text-muted-foreground">אין תוכנית עדיין</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <Progress value={row.progress.rate} className="w-24" />
                    <span className="text-xs text-muted-foreground">
                      {row.progress.completed}/{row.progress.total}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {row.latestFatigue !== undefined ? (
                  <Badge variant={row.latestFatigue >= 4 ? "warning" : "muted"}>{row.latestFatigue}/5</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <ConsentStatusBadge status={row.player.parentConsentStatus} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {row.openFlags.length === 0 ? (
                    <span className="text-xs text-muted-foreground">אין</span>
                  ) : (
                    row.openFlags.map((flag) => <RiskBadge key={flag.id} type={flag.type} />)
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
