import Link from "next/link";
import { notFound } from "next/navigation";
import { Footprints, Calendar, ShieldAlert } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { CoachNoteForm } from "@/components/coach-note-form";
import { ResolveFlagButton } from "@/components/resolve-flag-button";
import {
  getPlayerById,
  getTeamById,
  getAssignedTasksForPlayer,
  getTaskById,
  getTaskReportsForPlayer,
  getCoachNotesForPlayer,
  getOpenRiskFlagsForPlayer,
  getWeeklyPlanForPlayer,
} from "@/lib/data/store";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import { currentWeekLabel, formatDateTime } from "@/lib/date";

export default async function CoachPlayerProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const profile = await requireProfile("coach");
  const { playerId } = await params;
  const player = getPlayerById(playerId);
  if (!player) notFound();

  const team = getTeamById(player.teamId);
  if (!team || team.coachId !== profile.id) notFound();

  const plan = getWeeklyPlanForPlayer(player.id);
  const assignedTasks = getAssignedTasksForPlayer(player.id);
  const reports = getTaskReportsForPlayer(player.id);
  const notes = getCoachNotesForPlayer(player.id);
  const openFlags = getOpenRiskFlagsForPlayer(player.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm text-muted-foreground">{team.name} · {team.ageGroup}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{player.fullName}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">{player.position}</Badge>
            <Badge variant="outline">Age {player.age}</Badge>
            <Badge variant="outline" className="capitalize">{player.dominantFoot} footed</Badge>
            <Badge variant="outline">{player.weeklyAvailability}x / week available</Badge>
            <ConsentStatusBadge status={player.parentConsentStatus} />
          </div>
        </div>
        <Button asChild>
          <Link href={`/coach/assign?playerId=${player.id}`}>Assign tasks</Link>
        </Button>
      </div>

      {player.knownLimitations && (
        <Card className="border-warning/40 bg-warning-soft/40">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <span>{player.knownLimitations}</span>
          </CardContent>
        </Card>
      )}

      {openFlags.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Needs review</CardTitle>
            <CardDescription>Open safety flags for this player.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {openFlags.map((flag) => (
              <div key={flag.id} className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-2">
                  <RiskBadge type={flag.type} />
                  <p className="text-sm text-muted-foreground">{flag.note}</p>
                </div>
                <ResolveFlagButton riskFlagId={flag.id} playerId={player.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {player.parentConsentStatus !== "approved" && (
        <EmptyState
          title="Parent approval is required"
          description="This player will not see any training tasks until a parent completes consent."
          icon={ShieldAlert}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <CardTitle className="text-base">This week&apos;s plan · {currentWeekLabel()}</CardTitle>
          </div>
          {plan && <CardDescription>Focus: {plan.focusLabel ?? CATEGORY_LABELS[plan.focusArea as keyof typeof CATEGORY_LABELS] ?? plan.focusArea}</CardDescription>}
        </CardHeader>
        <CardContent>
          {assignedTasks.length === 0 ? (
            <EmptyState
              title="No tasks assigned yet"
              description="Use Assign Tasks to build this player's weekly plan."
              icon={Footprints}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedTasks.map((assigned) => {
                  const task = getTaskById(assigned.taskId);
                  return (
                    <TableRow key={assigned.id}>
                      <TableCell className="font-medium">{task?.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{task && CATEGORY_LABELS[task.category]}</TableCell>
                      <TableCell>
                        <Badge variant={assigned.status === "completed" ? "success" : assigned.status === "skipped" ? "destructive" : "muted"} className="capitalize">
                          {assigned.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Difficulty, fatigue, and pain reported after each task.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <EmptyState title="No reports yet" description="Reports will appear here after this player completes tasks." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Fatigue</TableHead>
                  <TableHead>Pain</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.difficulty}/5</TableCell>
                    <TableCell>
                      <Badge variant={report.fatigue >= 4 ? "warning" : "muted"}>{report.fatigue}/5</Badge>
                    </TableCell>
                    <TableCell>
                      {report.painReported ? <Badge variant="destructive">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">{report.note ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDateTime(report.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coach notes</CardTitle>
          <CardDescription>Private by default. Share with parents when relevant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CoachNoteForm playerId={player.id} />
          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge variant={note.visibility === "parent_visible" ? "success" : "muted"}>
                      {note.visibility === "parent_visible" ? "Shared with parent" : "Private"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="text-sm">{note.note}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
