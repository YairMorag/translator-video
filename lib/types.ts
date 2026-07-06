// Core domain types for NextPlay Academy.
// Mirrors the Supabase schema in supabase/migrations so the mock data layer
// can be swapped for real queries without touching UI code.

export type Role = "school_admin" | "coach" | "parent" | "player";

export type Position =
  | "goalkeeper"
  | "defender"
  | "midfielder"
  | "winger"
  | "striker";

export type DominantFoot = "left" | "right" | "both";

export type ConsentStatus = "pending" | "approved" | "revoked";

export type TaskCategory =
  | "ball_control"
  | "first_touch"
  | "passing"
  | "speed_agility"
  | "mobility"
  | "recovery"
  | "light_strength"
  | "position_specific";

export type Intensity = "low" | "medium" | "high";

export type PlanStatus = "draft" | "approved" | "completed";

export type AssignedTaskStatus = "assigned" | "started" | "completed" | "skipped";

export type NoteVisibility = "private" | "parent_visible";

export type RiskType = "pain" | "high_fatigue" | "no_activity" | "coach_review";

export type RiskSeverity = "low" | "medium" | "high";

export type RiskStatus = "open" | "resolved";

export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  schoolId: string;
  name: string;
  ageGroup: string;
  season: string;
  coachId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  authUserId: string;
  fullName: string;
  role: Role;
  schoolId: string;
  email: string;
  createdAt: string;
}

export interface Player {
  id: string;
  profileId: string;
  schoolId: string;
  teamId: string;
  fullName: string;
  birthYear: number;
  age: number;
  position: Position;
  dominantFoot: DominantFoot;
  weeklyAvailability: number; // sessions per week the player can realistically do
  knownLimitations?: string;
  parentConsentStatus: ConsentStatus;
  createdAt: string;
}

export interface ParentPlayerLink {
  id: string;
  parentProfileId: string;
  playerId: string;
  relationship: string;
  createdAt: string;
}

export interface CoachTeamLink {
  id: string;
  coachProfileId: string;
  teamId: string;
  createdAt: string;
}

export interface TaskCatalogItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  ageMin: number;
  ageMax: number;
  positions: Position[] | "all";
  durationMinutes: number;
  intensity: Intensity;
  equipmentNeeded: string;
  instructions: string[];
  safetyNotes: string;
  whyItMatters: string;
  coachApprovedDefault: boolean;
}

export interface WeeklyPlan {
  id: string;
  playerId: string;
  coachId: string;
  weekStartDate: string;
  focusArea: string;
  /** Optional friendlier display label, e.g. "First touch and change of direction" */
  focusLabel?: string;
  status: PlanStatus;
  createdAt: string;
  approvedAt?: string;
}

export interface AssignedTask {
  id: string;
  weeklyPlanId: string;
  taskId: string;
  playerId: string;
  assignedByCoachId: string;
  dueDate: string;
  status: AssignedTaskStatus;
  createdAt: string;
}

export interface TaskReport {
  id: string;
  assignedTaskId: string;
  playerId: string;
  completed: boolean;
  difficulty: number; // 1-5
  fatigue: number; // 1-5
  painReported: boolean;
  note?: string;
  createdAt: string;
}

export interface CoachNote {
  id: string;
  coachId: string;
  playerId: string;
  note: string;
  visibility: NoteVisibility;
  createdAt: string;
}

export interface Consent {
  id: string;
  parentProfileId: string;
  playerId: string;
  consentType: string;
  status: ConsentStatus;
  acceptedAt?: string;
  revokedAt?: string;
}

export interface RiskFlag {
  id: string;
  playerId: string;
  source: string;
  type: RiskType;
  severity: RiskSeverity;
  status: RiskStatus;
  note?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ---- Convenience aggregate view models used across the UI ----

export interface PlayerWithContext extends Player {
  team?: Team;
  profile?: Profile;
  openRiskFlags: RiskFlag[];
  latestReport?: TaskReport;
}

export interface SuggestedTask {
  task: TaskCatalogItem;
  reason: string;
}

export interface SuggestionResult {
  suggested: SuggestedTask[];
  warnings: string[];
  blocked: boolean;
  blockReason?: string;
}
