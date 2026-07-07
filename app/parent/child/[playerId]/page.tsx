import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Clock, Dumbbell } from "lucide-react";

import { requireProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ConsentStatusBadge } from "@/components/consent-status-badge";
import { CoachApprovedBadge } from "@/components/coach-approved-badge";
import { RiskBadge } from "@/components/risk-badge";
import { EmptyState } from "@/components/empty-state";
import { ParentConcernForm } from "@/components/parent-concern-form";
import {
  getPlayersForParent,
  getTeamById,
  getProfileById,
  getWeeklyPlanForPlayer,
  getAssignedTasksForPlayer,
  getTaskById,
  getTaskReportsForPlayer,
  getOpenRiskFlagsForPlayer,
  getCoachNotesForPlayer,
} from "@/lib/data/store";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import { POSITION_LABELS, INTENSITY_LABELS, ASSIGNED_TASK_STATUS_LABELS } from "@/lib/labels";
import { currentWeekLabel, formatDate } from "@/lib/date";

export default async function ParentChildPage({ params }: { params: Promise<{ playerId: string }> }) {
  const profile = await requireProfile("parent");
  const { playerId } = await params;
  const child = getPlayersForParent(profile.id).find((p) => p.id === playerId);
  if (!child) notFound();

  const team = getTeamById(child.teamId);
  const plan = getWeeklyPlanForPlayer(child.id);
  const coach = plan ? getProfileById(plan.coachId) : undefined;
  const assignedTasks = getAssignedTasksForPlayer(child.id);
  const reports = getTaskReportsForPlayer(child.id);
  const openFlags = getOpenRiskFlagsForPlayer(child.id);
  const parentNotes = getCoachNotesForPlayer(child.id, false);
  const focusLabel = plan?.focusLabel ?? (plan ? CATEGORY_LABELS[plan.focusArea as keyof typeof CATEGORY_LABELS] : undefined);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm text-muted-foreground">{team?.name} · {POSITION_LABELS[child.position]}</p>
          <h1 className="text-xl font-semibold">{child.fullName}</h1>
        </div>
        <ConsentStatusBadge status={child.parentConsentStatus} />
      </div>

      {child.parentConsentStatus !== "approved" && (
        <Card className="border-warning/40 bg-warning-soft/40">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">משימות אימון ביתי מוסתרות מ-{child.fullName} עד שתשלימו את תהליך האישור.</p>
            <Button asChild size="sm">
              <Link href="/parent/consent">בדיקת אישור</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {openFlags.some((f) => f.type === "pain") && (
        <Card className="border-destructive/40 bg-destructive-soft/40">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p>הילד/ה שלך דיווח/ה על כאב. המאמן קיבל התראה. אנא הימנעו מאימון נוסף עד לבדיקה.</p>
          </CardContent>
        </Card>
      )}
      {openFlags.some((f) => f.type === "high_fatigue") && (
        <Card className="border-warning/40 bg-warning-soft/40">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p>הילד/ה שלך דיווח/ה לאחרונה על עייפות גבוהה. התאוששות היא חלק מהאימון — המאמן קיבל התראה.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>התוכנית השבועית · {currentWeekLabel()}</CardTitle>
          <CardDescription>
            {focusLabel ? `מיקוד: ${focusLabel}` : "טרם פורסמה תוכנית"}
            {coach && ` · אושר על ידי ${coach.fullName}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignedTasks.length === 0 ? (
            <EmptyState title="עדיין לא הוקצו משימות" description="המאמן יפרסם את התוכנית השבועית בקרוב." />
          ) : (
            assignedTasks.map((assigned) => {
              const task = getTaskById(assigned.taskId);
              if (!task) return null;
              return (
                <div key={assigned.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{task.title}</p>
                    <Badge variant={assigned.status === "completed" ? "success" : "muted"}>
                      {ASSIGNED_TASK_STATUS_LABELS[assigned.status]}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {task.durationMinutes} דקות</span>
                    <Badge variant="outline">עצימות {INTENSITY_LABELS[task.intensity]}</Badge>
                    <span className="inline-flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" /> {task.equipmentNeeded}</span>
                    <CoachApprovedBadge />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>דוחות</CardTitle>
          <CardDescription>איך הילד/ה שלך הרגיש/ה אחרי כל משימה.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <EmptyState title="אין דוחות עדיין" description="דוחות יופיעו כאן לאחר שהמשימות יושלמו." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קושי</TableHead>
                  <TableHead>עייפות</TableHead>
                  <TableHead>כאב</TableHead>
                  <TableHead>תאריך</TableHead>
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
                      {report.painReported ? <RiskBadge type="pain" /> : <span className="text-xs text-muted-foreground">לא</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {parentNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>הערות מהמאמן</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {parentNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border p-3 text-sm">
                <p>{note.note}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>יצירת קשר עם המאמן</CardTitle>
          <CardDescription>שלחו הערה או סמנו חשש — המאמן יחזור אליכם.</CardDescription>
        </CardHeader>
        <CardContent>
          <ParentConcernForm playerId={child.id} />
        </CardContent>
      </Card>
    </div>
  );
}
