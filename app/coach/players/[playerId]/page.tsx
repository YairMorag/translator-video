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
import { POSITION_LABELS, DOMINANT_FOOT_LABELS, ASSIGNED_TASK_STATUS_LABELS, NOTE_VISIBILITY_LABELS } from "@/lib/labels";
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
            <Badge variant="outline">{POSITION_LABELS[player.position]}</Badge>
            <Badge variant="outline">גיל {player.age}</Badge>
            <Badge variant="outline">רגל {DOMINANT_FOOT_LABELS[player.dominantFoot]}</Badge>
            <Badge variant="outline">זמין {player.weeklyAvailability} פעמים בשבוע</Badge>
            <ConsentStatusBadge status={player.parentConsentStatus} />
          </div>
        </div>
        <Button asChild>
          <Link href={`/coach/assign?playerId=${player.id}`}>הקצאת משימות</Link>
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
            <CardTitle className="text-destructive">דורש בדיקה</CardTitle>
            <CardDescription>דגלי בטיחות פתוחים עבור שחקן זה.</CardDescription>
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
          title="נדרש אישור הורה"
          description="השחקן לא יראה משימות אימון עד שהורה ישלים את תהליך האישור."
          icon={ShieldAlert}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <CardTitle className="text-base">התוכנית השבועית · {currentWeekLabel()}</CardTitle>
          </div>
          {plan && <CardDescription>מיקוד: {plan.focusLabel ?? CATEGORY_LABELS[plan.focusArea as keyof typeof CATEGORY_LABELS] ?? plan.focusArea}</CardDescription>}
        </CardHeader>
        <CardContent>
          {assignedTasks.length === 0 ? (
            <EmptyState
              title="טרם הוקצו משימות"
              description="השתמשו בהקצאת משימות כדי לבנות את התוכנית השבועית של השחקן."
              icon={Footprints}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>משימה</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>סטטוס</TableHead>
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
                        <Badge variant={assigned.status === "completed" ? "success" : assigned.status === "skipped" ? "destructive" : "muted"}>
                          {ASSIGNED_TASK_STATUS_LABELS[assigned.status]}
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
          <CardTitle>דוחות</CardTitle>
          <CardDescription>קושי, עייפות וכאב שדווחו אחרי כל משימה.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <EmptyState title="אין דוחות עדיין" description="דוחות יופיעו כאן אחרי שהשחקן ישלים משימות." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קושי</TableHead>
                  <TableHead>עייפות</TableHead>
                  <TableHead>כאב</TableHead>
                  <TableHead>הערה</TableHead>
                  <TableHead>מתי</TableHead>
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
                      {report.painReported ? <Badge variant="destructive">כן</Badge> : <span className="text-xs text-muted-foreground">לא</span>}
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
          <CardTitle>הערות מאמן</CardTitle>
          <CardDescription>פרטי כברירת מחדל. שתפו עם הורים כשרלוונטי.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CoachNoteForm playerId={player.id} />
          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין הערות עדיין.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge variant={note.visibility === "parent_visible" ? "success" : "muted"}>
                      {NOTE_VISIBILITY_LABELS[note.visibility]}
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
