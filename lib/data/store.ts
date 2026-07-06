import { isAfter, isBefore, subDays } from "date-fns";
import type {
  Player,
  Profile,
  Team,
  TaskCatalogItem,
  WeeklyPlan,
  AssignedTask,
  AssignedTaskStatus,
  TaskReport,
  CoachNote,
  NoteVisibility,
  Consent,
  ConsentStatus,
  RiskFlag,
  RiskType,
  RiskSeverity,
} from "@/lib/types";
import {
  SCHOOL,
  TEAMS,
  ALL_PROFILES,
  COACH_TEAM_LINKS,
  PLAYERS,
  PARENT_PLAYER_LINKS,
  CONSENTS,
  WEEKLY_PLANS,
  ASSIGNED_TASKS,
  TASK_REPORTS,
  COACH_NOTES,
  RISK_FLAGS,
  CURRENT_WEEK_START,
} from "@/lib/data/seed";
import { TASK_CATALOG } from "@/lib/data/task-catalog";

// A tiny in-memory "database". Reads and writes go through the functions
// below so the rest of the app never touches the arrays directly — that
// keeps this file the single seam to swap for real Supabase queries later.

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// ---- Schools & teams ----

export function getSchool() {
  return SCHOOL;
}

export function getTeams(schoolId: string = SCHOOL.id): Team[] {
  return TEAMS.filter((t) => t.schoolId === schoolId);
}

export function getTeamById(teamId: string): Team | undefined {
  return TEAMS.find((t) => t.id === teamId);
}

export function getTeamsForCoach(coachProfileId: string): Team[] {
  const teamIds = new Set(
    COACH_TEAM_LINKS.filter((l) => l.coachProfileId === coachProfileId).map((l) => l.teamId)
  );
  return TEAMS.filter((t) => teamIds.has(t.id));
}

// ---- Profiles ----

export function getProfileByEmail(email: string): Profile | undefined {
  return ALL_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
}

export function getProfileById(id: string): Profile | undefined {
  return ALL_PROFILES.find((p) => p.id === id);
}

export function getCoaches(schoolId: string = SCHOOL.id): Profile[] {
  return ALL_PROFILES.filter((p) => p.role === "coach" && p.schoolId === schoolId);
}

// ---- Players ----

export function getPlayers(schoolId: string = SCHOOL.id): Player[] {
  return PLAYERS.filter((p) => p.schoolId === schoolId);
}

export function getPlayerById(playerId: string): Player | undefined {
  return PLAYERS.find((p) => p.id === playerId);
}

export function getPlayerByProfileId(profileId: string): Player | undefined {
  return PLAYERS.find((p) => p.profileId === profileId);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return PLAYERS.filter((p) => p.teamId === teamId);
}

export function getPlayersForCoach(coachProfileId: string): Player[] {
  const teamIds = new Set(getTeamsForCoach(coachProfileId).map((t) => t.id));
  return PLAYERS.filter((p) => teamIds.has(p.teamId));
}

export function getPlayersForParent(parentProfileId: string): Player[] {
  const playerIds = new Set(
    PARENT_PLAYER_LINKS.filter((l) => l.parentProfileId === parentProfileId).map((l) => l.playerId)
  );
  return PLAYERS.filter((p) => playerIds.has(p.id));
}

export function getParentForPlayer(playerId: string): Profile | undefined {
  const link = PARENT_PLAYER_LINKS.find((l) => l.playerId === playerId);
  return link ? getProfileById(link.parentProfileId) : undefined;
}

// ---- Task catalog ----

export function getTaskCatalog(): TaskCatalogItem[] {
  return TASK_CATALOG;
}

export function getTaskById(taskId: string): TaskCatalogItem | undefined {
  return TASK_CATALOG.find((t) => t.id === taskId);
}

// ---- Weekly plans & assigned tasks ----

export function getWeeklyPlanForPlayer(
  playerId: string,
  weekStartIso: string = CURRENT_WEEK_START.toISOString()
): WeeklyPlan | undefined {
  return WEEKLY_PLANS.find((p) => p.playerId === playerId && p.weekStartDate === weekStartIso);
}

export function getWeeklyPlansForPlayer(playerId: string): WeeklyPlan[] {
  return WEEKLY_PLANS.filter((p) => p.playerId === playerId).sort(
    (a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
  );
}

export function getAssignedTasksForPlan(planId: string): AssignedTask[] {
  return ASSIGNED_TASKS.filter((a) => a.weeklyPlanId === planId);
}

export function getAssignedTaskById(assignedTaskId: string): AssignedTask | undefined {
  return ASSIGNED_TASKS.find((a) => a.id === assignedTaskId);
}

export function getAssignedTasksForPlayer(
  playerId: string,
  weekStartIso: string = CURRENT_WEEK_START.toISOString()
): AssignedTask[] {
  const plan = getWeeklyPlanForPlayer(playerId, weekStartIso);
  if (!plan) return [];
  return getAssignedTasksForPlan(plan.id);
}

export function getAllAssignedTasksForPlayer(playerId: string): AssignedTask[] {
  return ASSIGNED_TASKS.filter((a) => a.playerId === playerId);
}

// ---- Reports ----

export function getTaskReportsForPlayer(playerId: string): TaskReport[] {
  return TASK_REPORTS.filter((r) => r.playerId === playerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReportForAssignedTask(assignedTaskId: string): TaskReport | undefined {
  return TASK_REPORTS.find((r) => r.assignedTaskId === assignedTaskId);
}

export function getRecentReportsForPlayer(playerId: string, days = 14): TaskReport[] {
  const cutoff = subDays(new Date(), days);
  return getTaskReportsForPlayer(playerId).filter((r) => isAfter(new Date(r.createdAt), cutoff));
}

// ---- Coach notes ----

export function getCoachNotesForPlayer(playerId: string, includePrivate = true): CoachNote[] {
  return COACH_NOTES.filter((n) => n.playerId === playerId && (includePrivate || n.visibility === "parent_visible")).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addCoachNote(
  coachId: string,
  playerId: string,
  note: string,
  visibility: NoteVisibility
): CoachNote {
  const entry: CoachNote = {
    id: nextId("note"),
    coachId,
    playerId,
    note,
    visibility,
    createdAt: new Date().toISOString(),
  };
  COACH_NOTES.push(entry);
  return entry;
}

// ---- Consent ----

export function getConsentForPlayer(playerId: string): Consent | undefined {
  return CONSENTS.find((c) => c.playerId === playerId);
}

export function setConsentStatus(playerId: string, status: ConsentStatus): void {
  const consent = getConsentForPlayer(playerId);
  const now = new Date().toISOString();
  if (consent) {
    consent.status = status;
    if (status === "approved") consent.acceptedAt = now;
    if (status === "revoked") consent.revokedAt = now;
  }
  const player = getPlayerById(playerId);
  if (player) player.parentConsentStatus = status;
}

// ---- Risk flags ----

export function getRiskFlags(schoolId: string = SCHOOL.id): RiskFlag[] {
  const playerIds = new Set(getPlayers(schoolId).map((p) => p.id));
  return RISK_FLAGS.filter((r) => playerIds.has(r.playerId)).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOpenRiskFlagsForPlayer(playerId: string): RiskFlag[] {
  return RISK_FLAGS.filter((r) => r.playerId === playerId && r.status === "open");
}

export function getOpenRiskFlagsForTeam(teamId: string): RiskFlag[] {
  const playerIds = new Set(getPlayersByTeam(teamId).map((p) => p.id));
  return RISK_FLAGS.filter((r) => playerIds.has(r.playerId) && r.status === "open");
}

export function resolveRiskFlag(riskFlagId: string): void {
  const flag = RISK_FLAGS.find((r) => r.id === riskFlagId);
  if (flag) {
    flag.status = "resolved";
    flag.resolvedAt = new Date().toISOString();
  }
}

function createRiskFlag(
  playerId: string,
  type: RiskType,
  severity: RiskSeverity,
  note: string,
  source: string
): RiskFlag {
  const flag: RiskFlag = {
    id: nextId("risk"),
    playerId,
    source,
    type,
    severity,
    status: "open",
    note,
    createdAt: new Date().toISOString(),
  };
  RISK_FLAGS.push(flag);
  return flag;
}

// ---- Core mutation: completing a task report ----

export interface SubmitTaskReportInput {
  completed: boolean;
  difficulty: number;
  fatigue: number;
  painReported: boolean;
  note?: string;
}

export function startAssignedTask(assignedTaskId: string): void {
  const task = getAssignedTaskById(assignedTaskId);
  if (task && task.status === "assigned") {
    task.status = "started";
  }
}

export function submitTaskReport(
  assignedTaskId: string,
  input: SubmitTaskReportInput
): { report: TaskReport; riskFlags: RiskFlag[] } {
  const assignedTask = getAssignedTaskById(assignedTaskId);
  if (!assignedTask) {
    throw new Error("Assigned task not found");
  }

  const report: TaskReport = {
    id: nextId("report"),
    assignedTaskId,
    playerId: assignedTask.playerId,
    completed: input.completed,
    difficulty: input.difficulty,
    fatigue: input.fatigue,
    painReported: input.painReported,
    note: input.note,
    createdAt: new Date().toISOString(),
  };
  TASK_REPORTS.push(report);

  assignedTask.status = input.completed ? "completed" : "skipped";

  const player = getPlayerById(assignedTask.playerId);
  const task = getTaskById(assignedTask.taskId);
  const newFlags: RiskFlag[] = [];

  if (input.painReported && player) {
    newFlags.push(
      createRiskFlag(
        player.id,
        "pain",
        "high",
        `דווח כאב במהלך "${task?.title ?? "משימת בית"}". האימון הביתי צריך להיעצר עד לבדיקת מאמן.`,
        "task_report"
      )
    );
  } else if (input.fatigue >= 4 && player) {
    newFlags.push(
      createRiskFlag(
        player.id,
        "high_fatigue",
        "medium",
        `דווחה עייפות ברמה ${input.fatigue}/5 לאחר "${task?.title ?? "משימת בית"}".`,
        "task_report"
      )
    );
  }

  return { report, riskFlags: newFlags };
}

// ---- Assigning weekly plans (coach flow) ----

export interface CreateWeeklyPlanInput {
  playerId: string;
  coachId: string;
  focusArea: string;
  focusLabel?: string;
  taskIds: string[];
  weekStartIso?: string;
}

export function createApprovedWeeklyPlan(input: CreateWeeklyPlanInput): WeeklyPlan {
  const weekStartDate = input.weekStartIso ?? CURRENT_WEEK_START.toISOString();
  const now = new Date().toISOString();

  // Re-assigning for a player/week that already has a plan updates it in place
  // rather than deleting and recreating it — that would orphan any reports a
  // player already submitted against this week's assigned tasks.
  let plan = WEEKLY_PLANS.find((p) => p.playerId === input.playerId && p.weekStartDate === weekStartDate);

  if (plan) {
    plan.coachId = input.coachId;
    plan.focusArea = input.focusArea;
    plan.focusLabel = input.focusLabel;
    plan.status = "approved";
    plan.approvedAt = now;

    // Only drop tasks the player hasn't touched yet — started/completed/skipped
    // tasks (and their reports) are preserved.
    for (let i = ASSIGNED_TASKS.length - 1; i >= 0; i -= 1) {
      const task = ASSIGNED_TASKS[i];
      if (task.weeklyPlanId === plan.id && task.status === "assigned") {
        ASSIGNED_TASKS.splice(i, 1);
      }
    }
  } else {
    plan = {
      id: nextId("plan"),
      playerId: input.playerId,
      coachId: input.coachId,
      weekStartDate,
      focusArea: input.focusArea,
      focusLabel: input.focusLabel,
      status: "approved",
      createdAt: now,
      approvedAt: now,
    };
    WEEKLY_PLANS.push(plan);
  }

  const existingTaskIds = new Set(getAssignedTasksForPlan(plan.id).map((t) => t.taskId));

  input.taskIds.forEach((taskId, index) => {
    if (existingTaskIds.has(taskId)) return;
    const assignedTask: AssignedTask = {
      id: nextId("assigned"),
      weeklyPlanId: plan.id,
      taskId,
      playerId: input.playerId,
      assignedByCoachId: input.coachId,
      dueDate: new Date(new Date(weekStartDate).getTime() + (index * 2 + 1) * 86400000).toISOString(),
      status: "assigned" as AssignedTaskStatus,
      createdAt: now,
    };
    ASSIGNED_TASKS.push(assignedTask);
  });

  return plan;
}

// ---- Parent concern messages (lightweight, in-memory) ----

export interface ParentMessage {
  id: string;
  parentProfileId: string;
  playerId: string;
  note: string;
  createdAt: string;
}

export const PARENT_MESSAGES: ParentMessage[] = [];

export function submitParentConcern(parentProfileId: string, playerId: string, note: string): ParentMessage {
  const message: ParentMessage = {
    id: nextId("concern"),
    parentProfileId,
    playerId,
    note,
    createdAt: new Date().toISOString(),
  };
  PARENT_MESSAGES.push(message);
  return message;
}

export function getParentMessagesForPlayer(playerId: string): ParentMessage[] {
  return PARENT_MESSAGES.filter((m) => m.playerId === playerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export { CURRENT_WEEK_START };
export function isDueThisWeek(dueDateIso: string): boolean {
  const due = new Date(dueDateIso);
  const weekEnd = new Date(CURRENT_WEEK_START.getTime() + 7 * 86400000);
  return !isBefore(due, CURRENT_WEEK_START) && isBefore(due, weekEnd);
}
