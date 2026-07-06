// Central Hebrew display-label maps for domain enums. Enum values themselves
// stay in English (types, data, routes) — only what's rendered on screen is
// Hebrew, looked up here so it's never duplicated or left untranslated.

import type {
  Position,
  DominantFoot,
  Intensity,
  AssignedTaskStatus,
  PlanStatus,
  NoteVisibility,
  Role,
  ConsentStatus,
  RiskType,
} from "@/lib/types";

export const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: "שוער",
  defender: "בלם",
  midfielder: "קשר",
  winger: "כנף",
  striker: "חלוץ",
};

export const DOMINANT_FOOT_LABELS: Record<DominantFoot, string> = {
  left: "שמאל",
  right: "ימין",
  both: "שתי הרגליים",
};

export const INTENSITY_LABELS: Record<Intensity, string> = {
  low: "קלה",
  medium: "בינונית",
  high: "גבוהה",
};

export const ASSIGNED_TASK_STATUS_LABELS: Record<AssignedTaskStatus, string> = {
  assigned: "טרם התחיל",
  started: "בתהליך",
  completed: "הושלם",
  skipped: "דולג",
};

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  draft: "טיוטה",
  approved: "מאושרת",
  completed: "הושלמה",
};

export const NOTE_VISIBILITY_LABELS: Record<NoteVisibility, string> = {
  private: "פרטי",
  parent_visible: "גלוי להורה",
};

export const ROLE_LABELS: Record<Role, string> = {
  school_admin: "מנהל בית ספר",
  coach: "מאמן",
  parent: "הורה",
  player: "שחקן",
};

export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  approved: "אישור הורה התקבל",
  pending: "ממתין לאישור הורה",
  revoked: "האישור בוטל",
};

export const RISK_TYPE_LABELS: Record<RiskType, string> = {
  pain: "דווח כאב",
  high_fatigue: "עייפות גבוהה",
  no_activity: "אין פעילות",
  coach_review: "נדרשת בדיקת מאמן",
};
