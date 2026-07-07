"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { suggestTasksForPlayer } from "@/lib/rules-engine";
import { approveWeeklyPlanAction } from "@/lib/actions/coach-actions";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import { POSITION_LABELS, INTENSITY_LABELS } from "@/lib/labels";
import type { Player, Team, TaskCatalogItem, TaskReport, TaskCategory } from "@/lib/types";

const FOCUS_OPTIONS = Object.entries(CATEGORY_LABELS) as [TaskCategory, string][];

interface Props {
  teams: Team[];
  players: Player[];
  taskCatalog: TaskCatalogItem[];
  recentReportsByPlayer: Record<string, TaskReport[]>;
  defaultTeamId?: string;
  defaultPlayerId?: string;
}

export function AssignTaskFlow({ teams, players, taskCatalog, recentReportsByPlayer, defaultTeamId, defaultPlayerId }: Props) {
  const initialTeamId = defaultTeamId ?? teams[0]?.id ?? "";
  const [teamId, setTeamId] = useState(initialTeamId);
  const teamPlayers = useMemo(
    () => players.filter((p) => p.teamId === teamId && p.parentConsentStatus === "approved"),
    [players, teamId]
  );

  const [playerId, setPlayerId] = useState(defaultPlayerId ?? teamPlayers[0]?.id ?? "");
  const [focusArea, setFocusArea] = useState<TaskCategory>("ball_control");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. בחירת קבוצה ומיקוד</CardTitle>
          <CardDescription>ההצעות נוצרות על ידי מנוע חוקים דטרמיניסטי — אתם תמיד מאשרים את התוכנית הסופית.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>קבוצה</Label>
            <Select
              value={teamId}
              onValueChange={(v) => {
                setTeamId(v);
                const first = players.find((p) => p.teamId === v && p.parentConsentStatus === "approved");
                setPlayerId(first?.id ?? "");
              }}
            >
              <SelectTrigger><SelectValue placeholder="בחרו קבוצה" /></SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>מיקוד שבועי</Label>
            <Select value={focusArea} onValueChange={(v) => setFocusArea(v as TaskCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FOCUS_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>שבוע</Label>
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              השבוע (נוכחי)
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="player">
        <TabsList>
          <TabsTrigger value="player">שחקן בודד</TabsTrigger>
          <TabsTrigger value="team">כל הקבוצה</TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <SinglePlayerAssign
            teamPlayers={teamPlayers}
            playerId={playerId}
            setPlayerId={setPlayerId}
            focusArea={focusArea}
            taskCatalog={taskCatalog}
            recentReportsByPlayer={recentReportsByPlayer}
          />
        </TabsContent>
        <TabsContent value="team">
          <TeamAssign
            teamPlayers={teamPlayers}
            focusArea={focusArea}
            taskCatalog={taskCatalog}
            recentReportsByPlayer={recentReportsByPlayer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SinglePlayerAssign({
  teamPlayers,
  playerId,
  setPlayerId,
  focusArea,
  taskCatalog,
  recentReportsByPlayer,
}: {
  teamPlayers: Player[];
  playerId: string;
  setPlayerId: (id: string) => void;
  focusArea: TaskCategory;
  taskCatalog: TaskCatalogItem[];
  recentReportsByPlayer: Record<string, TaskReport[]>;
}) {
  const player = teamPlayers.find((p) => p.id === playerId);
  const [generated, setGenerated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  const suggestion = useMemo(() => {
    if (!player) return null;
    return suggestTasksForPlayer(player, recentReportsByPlayer[player.id] ?? [], taskCatalog, focusArea);
  }, [player, recentReportsByPlayer, taskCatalog, focusArea]);

  function handleGenerate() {
    if (!suggestion) return;
    setSelectedIds(suggestion.suggested.map((s) => s.task.id));
    setGenerated(true);
    setResult(null);
  }

  function handleApprove() {
    if (!player) return;
    startTransition(async () => {
      const res = await approveWeeklyPlanAction(player.id, focusArea, undefined, selectedIds);
      setResult(res);
    });
  }

  if (teamPlayers.length === 0) {
    return <EmptyState title="אין שחקנים עם אישור הורה בקבוצה זו" description="שחקנים זקוקים לאישור הורה מאושר לפני שניתן להקצות להם משימות." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. בחירת שחקן ויצירת הצעות</CardTitle>
        <CardDescription>בדקו וערכו לפני האישור — שום דבר לא מגיע לשחקן עד שתאשרו.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>שחקן</Label>
            <Select
              value={playerId}
              onValueChange={(v) => {
                setPlayerId(v);
                setGenerated(false);
                setResult(null);
              }}
            >
              <SelectTrigger><SelectValue placeholder="בחרו שחקן" /></SelectTrigger>
              <SelectContent>
                {teamPlayers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.fullName} · {POSITION_LABELS[p.position]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={handleGenerate} className="w-full">
              <Sparkles className="h-4 w-4" /> יצירת הצעות
            </Button>
          </div>
        </div>

        {generated && suggestion && (
          <div className="space-y-4 border-t border-border pt-4">
            {suggestion.warnings.map((w) => (
              <p key={w} className="rounded-md bg-warning-soft px-3 py-2 text-sm text-warning">{w}</p>
            ))}

            {suggestion.blocked ? (
              <EmptyState title="לא הוצעו משימות" description="מומלץ שהמאמן יבדוק את השחקן לפני הקצאת אימון ביתי חדש." />
            ) : (
              <div className="space-y-2">
                {suggestion.suggested.map(({ task, reason }) => {
                  const checked = selectedIds.includes(task.id);
                  return (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelectedIds((prev) =>
                            e.target.checked ? [...prev, task.id] : prev.filter((id) => id !== task.id)
                          )
                        }
                        className="mt-1 h-4 w-4"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{task.title}</p>
                          <Badge variant="outline">{task.durationMinutes} דקות</Badge>
                          <Badge variant="outline">עצימות {INTENSITY_LABELS[task.intensity]}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{reason}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {!suggestion.blocked && (
              <Button onClick={handleApprove} disabled={pending || selectedIds.length === 0} className="w-full sm:w-auto">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                אישור התוכנית השבועית
              </Button>
            )}

            {result?.error && <p className="text-sm text-destructive">{result.error}</p>}
            {result?.success && player && (
              <div className="flex flex-col gap-2 rounded-md bg-success-soft px-3 py-3 text-sm text-success sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> התוכנית אושרה עבור {player.fullName}.</span>
                <Link href={`/coach/players/${player.id}`} className="inline-flex items-center gap-1 font-medium hover:underline">
                  צפייה בשחקן <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamAssign({
  teamPlayers,
  focusArea,
  taskCatalog,
  recentReportsByPlayer,
}: {
  teamPlayers: Player[];
  focusArea: TaskCategory;
  taskCatalog: TaskCatalogItem[];
  recentReportsByPlayer: Record<string, TaskReport[]>;
}) {
  const [pending, startTransition] = useTransition();
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const previews = useMemo(
    () =>
      teamPlayers.map((player) => ({
        player,
        suggestion: suggestTasksForPlayer(player, recentReportsByPlayer[player.id] ?? [], taskCatalog, focusArea),
      })),
    [teamPlayers, taskCatalog, recentReportsByPlayer, focusArea]
  );

  function handleApproveAll() {
    startTransition(async () => {
      const newlyApproved: string[] = [];
      for (const { player, suggestion } of previews) {
        if (suggestion.blocked || suggestion.suggested.length === 0) continue;
        const res = await approveWeeklyPlanAction(
          player.id,
          focusArea,
          undefined,
          suggestion.suggested.map((s) => s.task.id)
        );
        if (res.success) newlyApproved.push(player.id);
      }
      setApprovedIds(newlyApproved);
    });
  }

  if (teamPlayers.length === 0) {
    return <EmptyState title="אין שחקנים עם אישור הורה בקבוצה זו" description="שחקנים זקוקים לאישור הורה מאושר לפני שניתן להקצות להם משימות." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. תצוגה מקדימה ואישור לכל הקבוצה</CardTitle>
        <CardDescription>
          כל שחקן מקבל הצעות משלו בהתאם לגיל, לעמדה ולדיווחי עייפות או כאב אחרונים.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {previews.map(({ player, suggestion }) => (
          <div key={player.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {player.fullName} <span className="font-normal text-muted-foreground">· {POSITION_LABELS[player.position]}</span>
              </p>
              {approvedIds.includes(player.id) && (
                <Badge variant="success"><CheckCircle2 className="h-3.5 w-3.5" /> אושר</Badge>
              )}
            </div>
            {suggestion.blocked ? (
              <p className="mt-1 text-xs text-warning">{suggestion.warnings[0] ?? "לא הוצעו משימות — נדרשת בדיקת מאמן."}</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {suggestion.suggested.map((s) => (
                  <li key={s.task.id}>{`• ${s.task.title} (${s.task.durationMinutes} דקות)`}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <Button onClick={handleApproveAll} disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          אישור התוכנית השבועית לכל הקבוצה
        </Button>
      </CardContent>
    </Card>
  );
}
