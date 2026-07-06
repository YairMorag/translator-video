import { startOfWeek, addDays, subDays, subWeeks } from "date-fns";
import type {
  School,
  Team,
  Profile,
  Player,
  ParentPlayerLink,
  CoachTeamLink,
  WeeklyPlan,
  AssignedTask,
  TaskReport,
  CoachNote,
  Consent,
  RiskFlag,
} from "@/lib/types";

const NOW = new Date();
export const CURRENT_WEEK_START = startOfWeek(NOW, { weekStartsOn: 1 });
const PREVIOUS_WEEK_START = subWeeks(CURRENT_WEEK_START, 1);
const TWO_WEEKS_AGO_START = subWeeks(CURRENT_WEEK_START, 2);

function iso(d: Date) {
  return d.toISOString();
}

export const SCHOOL: School = {
  id: "school-1",
  name: "North Valley Football Academy",
  createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
};

export const TEAMS: Team[] = [
  {
    id: "team-u10",
    schoolId: SCHOOL.id,
    name: "U10",
    ageGroup: "U10",
    season: "2025/2026",
    coachId: "profile-coach-amir",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
  {
    id: "team-u12",
    schoolId: SCHOOL.id,
    name: "U12",
    ageGroup: "U12",
    season: "2025/2026",
    coachId: "profile-coach-amir",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
  {
    id: "team-u14",
    schoolId: SCHOOL.id,
    name: "U14",
    ageGroup: "U14",
    season: "2025/2026",
    coachId: "profile-coach-ron",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
];

// ---- Profiles ----
// Demo login profiles map 1:1 to the four demo accounts documented in the README.
export const PROFILES: Profile[] = [
  {
    id: "profile-admin",
    authUserId: "auth-admin",
    fullName: "Dana Shapiro",
    role: "school_admin",
    schoolId: SCHOOL.id,
    email: "admin@nextplay.demo",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
  {
    id: "profile-coach-amir",
    authUserId: "auth-coach-amir",
    fullName: "Amir Levi",
    role: "coach",
    schoolId: SCHOOL.id,
    email: "coach@nextplay.demo",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
  {
    id: "profile-coach-ron",
    authUserId: "auth-coach-ron",
    fullName: "Ron Cohen",
    role: "coach",
    schoolId: SCHOOL.id,
    email: "ron.cohen@nextplay.demo",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 20)),
  },
  {
    id: "profile-parent-katz",
    authUserId: "auth-parent-katz",
    fullName: "Noa Katz",
    role: "parent",
    schoolId: SCHOOL.id,
    email: "parent@nextplay.demo",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 18)),
  },
  {
    id: "profile-player-daniel",
    authUserId: "auth-player-daniel",
    fullName: "Daniel Katz",
    role: "player",
    schoolId: SCHOOL.id,
    email: "player@nextplay.demo",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 18)),
  },
];

export const COACH_TEAM_LINKS: CoachTeamLink[] = [
  { id: "ctl-1", coachProfileId: "profile-coach-amir", teamId: "team-u10", createdAt: iso(CURRENT_WEEK_START) },
  { id: "ctl-2", coachProfileId: "profile-coach-amir", teamId: "team-u12", createdAt: iso(CURRENT_WEEK_START) },
  { id: "ctl-3", coachProfileId: "profile-coach-ron", teamId: "team-u14", createdAt: iso(CURRENT_WEEK_START) },
];

// ---- Players ----
// birthYear is derived from an approximate "current season" age so seed data
// stays sensible without needing to hardcode a specific year.
const SEASON_YEAR = NOW.getFullYear();

interface PlayerSeed {
  id: string;
  fullName: string;
  age: number;
  teamId: string;
  position: Player["position"];
  dominantFoot: Player["dominantFoot"];
  weeklyAvailability: number;
  parentConsentStatus: Player["parentConsentStatus"];
  knownLimitations?: string;
}

const PLAYER_SEEDS: PlayerSeed[] = [
  // U10
  { id: "player-yuval", fullName: "Yuval Peretz", age: 10, teamId: "team-u10", position: "goalkeeper", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-omer", fullName: "Omer Biton", age: 9, teamId: "team-u10", position: "defender", dominantFoot: "left", weeklyAvailability: 2, parentConsentStatus: "approved" },
  { id: "player-itay", fullName: "Itay Malka", age: 10, teamId: "team-u10", position: "midfielder", dominantFoot: "right", weeklyAvailability: 2, parentConsentStatus: "pending" },
  { id: "player-adam", fullName: "Adam Rozen", age: 9, teamId: "team-u10", position: "winger", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-liam", fullName: "Liam Azulay", age: 10, teamId: "team-u10", position: "striker", dominantFoot: "left", weeklyAvailability: 2, parentConsentStatus: "approved" },
  // U12
  { id: "player-daniel", fullName: "Daniel Katz", age: 12, teamId: "team-u12", position: "winger", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-noam", fullName: "Noam Shaked", age: 11, teamId: "team-u12", position: "goalkeeper", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-eitan", fullName: "Eitan Marom", age: 12, teamId: "team-u12", position: "defender", dominantFoot: "left", weeklyAvailability: 2, parentConsentStatus: "pending", knownLimitations: "Mild ankle sprain last season, fully resolved" },
  { id: "player-roy", fullName: "Roy Ben-David", age: 11, teamId: "team-u12", position: "midfielder", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-ariel", fullName: "Ariel Dahan", age: 12, teamId: "team-u12", position: "striker", dominantFoot: "right", weeklyAvailability: 2, parentConsentStatus: "approved" },
  // U14
  { id: "player-tomer", fullName: "Tomer Avraham", age: 14, teamId: "team-u14", position: "defender", dominantFoot: "right", weeklyAvailability: 4, parentConsentStatus: "approved" },
  { id: "player-yonatan", fullName: "Yonatan Sasson", age: 13, teamId: "team-u14", position: "midfielder", dominantFoot: "both", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-gil", fullName: "Gil Nachum", age: 14, teamId: "team-u14", position: "winger", dominantFoot: "left", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-amit", fullName: "Amit Barzilai", age: 13, teamId: "team-u14", position: "striker", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "approved" },
  { id: "player-nadav", fullName: "Nadav Elkayam", age: 14, teamId: "team-u14", position: "goalkeeper", dominantFoot: "right", weeklyAvailability: 3, parentConsentStatus: "pending" },
];

export const PLAYERS: Player[] = PLAYER_SEEDS.map((p) => ({
  id: p.id,
  profileId: p.id === "player-daniel" ? "profile-player-daniel" : `profile-${p.id}`,
  schoolId: SCHOOL.id,
  teamId: p.teamId,
  fullName: p.fullName,
  birthYear: SEASON_YEAR - p.age,
  age: p.age,
  position: p.position,
  dominantFoot: p.dominantFoot,
  weeklyAvailability: p.weeklyAvailability,
  knownLimitations: p.knownLimitations,
  parentConsentStatus: p.parentConsentStatus,
  createdAt: iso(subWeeks(CURRENT_WEEK_START, 16)),
}));

// Extra non-demo player profiles so every player has a matching profile row.
export const PLAYER_PROFILES: Profile[] = PLAYERS.filter((p) => p.id !== "player-daniel").map((p) => ({
  id: `profile-${p.id}`,
  authUserId: `auth-${p.id}`,
  fullName: p.fullName,
  role: "player",
  schoolId: SCHOOL.id,
  email: `${p.id}@nextplay.demo`,
  createdAt: p.createdAt,
}));

export const ALL_PROFILES: Profile[] = [...PROFILES, ...PLAYER_PROFILES];

export const PARENT_PLAYER_LINKS: ParentPlayerLink[] = [
  {
    id: "ppl-1",
    parentProfileId: "profile-parent-katz",
    playerId: "player-daniel",
    relationship: "parent",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 16)),
  },
  // A second, younger child with pending consent so the demo parent account
  // can show the full consent-approval flow (not just the already-approved case).
  {
    id: "ppl-2",
    parentProfileId: "profile-parent-katz",
    playerId: "player-itay",
    relationship: "parent",
    createdAt: iso(subWeeks(CURRENT_WEEK_START, 16)),
  },
];

export const CONSENTS: Consent[] = PLAYERS.map((p) => ({
  id: `consent-${p.id}`,
  parentProfileId:
    PARENT_PLAYER_LINKS.find((l) => l.playerId === p.id)?.parentProfileId ?? `profile-parent-of-${p.id}`,
  playerId: p.id,
  consentType: "home_training_participation",
  status: p.parentConsentStatus,
  acceptedAt: p.parentConsentStatus === "approved" ? iso(subWeeks(CURRENT_WEEK_START, 16)) : undefined,
}));

// ---- Weekly plans + assigned tasks + reports ----
// Only players with approved parental consent have an active weekly plan —
// consent gates whether training tasks are ever assigned or shown.

type Scenario = "completed_all" | "partial" | "not_started" | "pain" | "high_fatigue";

interface PlanSeed {
  playerId: string;
  coachId: string;
  focusArea: string;
  focusLabel?: string;
  taskIds: string[];
  scenario: Scenario;
}

const PLAN_SEEDS: PlanSeed[] = [
  { playerId: "player-yuval", coachId: "profile-coach-amir", focusArea: "position_specific", taskIds: ["task-6", "task-22", "task-9"], scenario: "completed_all" },
  { playerId: "player-omer", coachId: "profile-coach-amir", focusArea: "position_specific", taskIds: ["task-4", "task-3", "task-23"], scenario: "pain" },
  { playerId: "player-adam", coachId: "profile-coach-amir", focusArea: "ball_control", taskIds: ["task-2", "task-15", "task-21"], scenario: "partial" },
  { playerId: "player-liam", coachId: "profile-coach-amir", focusArea: "position_specific", taskIds: ["task-16", "task-3", "task-1"], scenario: "high_fatigue" },
  { playerId: "player-daniel", coachId: "profile-coach-amir", focusArea: "first_touch", focusLabel: "First touch and change of direction", taskIds: ["task-1", "task-3", "task-5"], scenario: "partial" },
  { playerId: "player-noam", coachId: "profile-coach-amir", focusArea: "position_specific", taskIds: ["task-6", "task-22", "task-14"], scenario: "completed_all" },
  { playerId: "player-roy", coachId: "profile-coach-amir", focusArea: "passing", taskIds: ["task-26", "task-11", "task-17"], scenario: "partial" },
  { playerId: "player-ariel", coachId: "profile-coach-amir", focusArea: "position_specific", taskIds: ["task-16", "task-15", "task-9"], scenario: "high_fatigue" },
  { playerId: "player-tomer", coachId: "profile-coach-ron", focusArea: "position_specific", taskIds: ["task-4", "task-23", "task-3"], scenario: "completed_all" },
  { playerId: "player-yonatan", coachId: "profile-coach-ron", focusArea: "passing", taskIds: ["task-26", "task-7", "task-17"], scenario: "partial" },
  { playerId: "player-gil", coachId: "profile-coach-ron", focusArea: "speed_agility", taskIds: ["task-5", "task-3", "task-13"], scenario: "not_started" },
  { playerId: "player-amit", coachId: "profile-coach-ron", focusArea: "position_specific", taskIds: ["task-16", "task-2", "task-9"], scenario: "completed_all" },
];

function statusesForScenario(scenario: Scenario): AssignedTask["status"][] {
  switch (scenario) {
    case "completed_all":
      return ["completed", "completed", "completed"];
    case "partial":
      return ["completed", "completed", "assigned"];
    case "not_started":
      return ["assigned", "assigned", "assigned"];
    case "pain":
      return ["completed", "assigned", "assigned"];
    case "high_fatigue":
      return ["completed", "assigned", "assigned"];
  }
}

let weeklyPlanCounter = 0;
let assignedTaskCounter = 0;
let taskReportCounter = 0;

export const WEEKLY_PLANS: WeeklyPlan[] = [];
export const ASSIGNED_TASKS: AssignedTask[] = [];
export const TASK_REPORTS: TaskReport[] = [];

for (const seed of PLAN_SEEDS) {
  weeklyPlanCounter += 1;
  const planId = `plan-${weeklyPlanCounter}`;
  WEEKLY_PLANS.push({
    id: planId,
    playerId: seed.playerId,
    coachId: seed.coachId,
    weekStartDate: iso(CURRENT_WEEK_START),
    focusArea: seed.focusArea,
    focusLabel: seed.focusLabel,
    status: "approved",
    createdAt: iso(subDays(CURRENT_WEEK_START, 2)),
    approvedAt: iso(subDays(CURRENT_WEEK_START, 1)),
  });

  const statuses = statusesForScenario(seed.scenario);
  seed.taskIds.forEach((taskId, index) => {
    assignedTaskCounter += 1;
    const assignedId = `assigned-${assignedTaskCounter}`;
    const status = statuses[index];
    ASSIGNED_TASKS.push({
      id: assignedId,
      weeklyPlanId: planId,
      taskId,
      playerId: seed.playerId,
      assignedByCoachId: seed.coachId,
      dueDate: iso(addDays(CURRENT_WEEK_START, index * 2 + 1)),
      status,
      createdAt: iso(subDays(CURRENT_WEEK_START, 1)),
    });

    if (status === "completed") {
      taskReportCounter += 1;
      const isPainTask = seed.scenario === "pain" && index === 0;
      const isFatigueTask = seed.scenario === "high_fatigue" && index === 0;
      TASK_REPORTS.push({
        id: `report-${taskReportCounter}`,
        assignedTaskId: assignedId,
        playerId: seed.playerId,
        completed: true,
        difficulty: isPainTask ? 3 : isFatigueTask ? 4 : 2 + (index % 2),
        fatigue: isFatigueTask ? (seed.playerId === "player-ariel" ? 5 : 4) : isPainTask ? 3 : 2,
        painReported: isPainTask,
        note: isPainTask
          ? "Felt a sharp pinch in my ankle during the drill."
          : isFatigueTask
          ? "Legs felt heavy today, still finished the session."
          : undefined,
        createdAt: iso(addDays(CURRENT_WEEK_START, index * 2 + 1)),
      });
    }
  });
}

// ---- Coach notes ----
export const COACH_NOTES: CoachNote[] = [
  {
    id: "note-1",
    coachId: "profile-coach-amir",
    playerId: "player-omer",
    note: "Reported ankle pain after the reaction-steps drill. Advised rest, no further home tasks until reviewed at next session.",
    visibility: "parent_visible",
    createdAt: iso(subDays(NOW, 1)),
  },
  {
    id: "note-2",
    coachId: "profile-coach-amir",
    playerId: "player-daniel",
    note: "Great focus on weak-foot control this week. Keep encouraging consistency over intensity.",
    visibility: "parent_visible",
    createdAt: iso(subDays(NOW, 2)),
  },
  {
    id: "note-3",
    coachId: "profile-coach-amir",
    playerId: "player-liam",
    note: "Watch training load — second high-fatigue report in three weeks.",
    visibility: "private",
    createdAt: iso(subDays(NOW, 1)),
  },
];

// ---- Risk flags ----
export const RISK_FLAGS: RiskFlag[] = [
  {
    id: "risk-1",
    playerId: "player-omer",
    source: "task_report",
    type: "pain",
    severity: "high",
    status: "open",
    note: "Pain reported during Defender Reaction Steps. Home training paused pending coach review.",
    createdAt: iso(subDays(NOW, 1)),
  },
  {
    id: "risk-2",
    playerId: "player-liam",
    source: "task_report",
    type: "high_fatigue",
    severity: "medium",
    status: "open",
    note: "Fatigue reported at 4/5 after Striker Finishing Touches.",
    createdAt: iso(subDays(NOW, 1)),
  },
  {
    id: "risk-3",
    playerId: "player-ariel",
    source: "task_report",
    type: "high_fatigue",
    severity: "medium",
    status: "open",
    note: "Fatigue reported at 5/5 after Striker Finishing Touches.",
    createdAt: iso(subDays(NOW, 2)),
  },
  {
    id: "risk-4",
    playerId: "player-gil",
    source: "weekly_plan",
    type: "no_activity",
    severity: "low",
    status: "open",
    note: "No tasks started yet this week.",
    createdAt: iso(subDays(NOW, 1)),
  },
];

// ---- Prior-week snapshot data for simple engagement trend charts ----
export const WEEKLY_ENGAGEMENT_TREND = [
  { weekStart: iso(TWO_WEEKS_AGO_START), label: "2 weeks ago", completionRate: 58 },
  { weekStart: iso(PREVIOUS_WEEK_START), label: "Last week", completionRate: 66 },
  { weekStart: iso(CURRENT_WEEK_START), label: "This week", completionRate: 74 },
];
