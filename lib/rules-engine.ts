import type {
  Player,
  TaskCatalogItem,
  TaskReport,
  SuggestionResult,
  SuggestedTask,
} from "@/lib/types";
import { POSITION_LABELS } from "@/lib/labels";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";

const MAX_WEEKLY_TASKS = 3;
const MAX_WEEKLY_DURATION_MINUTES = 90;
const HIGH_FATIGUE_THRESHOLD = 4;

const RECOVERY_CATEGORIES = new Set(["recovery", "mobility"]);

const POSITION_FOCUS: Record<Player["position"], string[]> = {
  goalkeeper: ["position_specific", "mobility", "ball_control"],
  defender: ["passing", "speed_agility", "position_specific"],
  midfielder: ["passing", "first_touch", "ball_control"],
  winger: ["speed_agility", "ball_control", "first_touch"],
  striker: ["first_touch", "ball_control", "position_specific"],
};

/**
 * Suggests a coach-reviewable set of weekly home-training tasks for a player.
 * This is a deterministic rules engine, not an autonomous AI decision-maker:
 * every suggestion still requires explicit coach approval before a player
 * ever sees it.
 */
export function suggestTasksForPlayer(
  player: Player,
  recentReports: TaskReport[],
  taskCatalog: TaskCatalogItem[],
  focusArea?: string
): SuggestionResult {
  const warnings: string[] = [];

  const mostRecentReport = [...recentReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // Safety rule: a recent pain report blocks all training suggestions.
  if (mostRecentReport?.painReported) {
    warnings.push(
      `${player.fullName} דיווח/ה על כאב בדיווח האחרון. לא יוצעו משימות אימון חדשות עד שמאמן יבדוק את השחקן/ית.`
    );
    return {
      suggested: [],
      warnings,
      blocked: true,
      blockReason: "pain_reported",
    };
  }

  const highFatigue = (mostRecentReport?.fatigue ?? 0) >= HIGH_FATIGUE_THRESHOLD;
  if (highFatigue) {
    warnings.push(
      `${player.fullName} דיווח/ה על עייפות גבוהה (${mostRecentReport?.fatigue}/5). השבוע יוצעו רק משימות התאוששות וניידות.`
    );
  }

  let pool = taskCatalog.filter((task) => {
    const ageOk = player.age >= task.ageMin && player.age <= task.ageMax;
    const positionOk = task.positions === "all" || task.positions.includes(player.position);
    return ageOk && positionOk;
  });

  if (highFatigue) {
    pool = pool.filter((task) => RECOVERY_CATEGORIES.has(task.category));
  } else if (focusArea) {
    const focusMatches = pool.filter((task) => task.category === focusArea);
    if (focusMatches.length > 0) {
      pool = focusMatches;
    }
  }

  // Prefer position-relevant categories, then fall back to whatever remains.
  const preferredCategories = POSITION_FOCUS[player.position] ?? [];
  pool.sort((a, b) => {
    const aScore = preferredCategories.indexOf(a.category);
    const bScore = preferredCategories.indexOf(b.category);
    const aRank = aScore === -1 ? 99 : aScore;
    const bRank = bScore === -1 ? 99 : bScore;
    if (aRank !== bRank) return aRank - bRank;
    // Younger players: prefer lower intensity, shorter duration.
    if (player.age <= 11) {
      const intensityRank = { low: 0, medium: 1, high: 2 };
      return intensityRank[a.intensity] - intensityRank[b.intensity];
    }
    return 0;
  });

  if (player.age <= 11) {
    pool = pool.filter((task) => task.intensity !== "high");
  }

  const suggested: SuggestedTask[] = [];
  let totalDuration = 0;

  for (const task of pool) {
    if (suggested.length >= MAX_WEEKLY_TASKS) break;
    if (totalDuration + task.durationMinutes > MAX_WEEKLY_DURATION_MINUTES) continue;
    suggested.push({
      task,
      reason: buildReason(player, task, focusArea, highFatigue),
    });
    totalDuration += task.durationMinutes;
  }

  if (suggested.length === 0) {
    warnings.push(
      "לא נמצאו משימות מתאימות לגיל, לעמדה ולמיקוד השבועי של השחקן/ית. נסו מיקוד אחר או בדקו את קטלוג המשימות."
    );
  }

  return { suggested, warnings, blocked: false };
}

function buildReason(
  player: Player,
  task: TaskCatalogItem,
  focusArea: string | undefined,
  highFatigue: boolean
): string {
  const positionLabel = POSITION_LABELS[player.position];
  if (highFatigue) {
    return `מוצע כי ${player.fullName} דיווח/ה לאחרונה על עייפות גבוהה, לכן נכללות רק משימות התאוששות/ניידות.`;
  }
  const focusText = focusArea
    ? `המיקוד השבועי הוא ${CATEGORY_LABELS[focusArea as keyof typeof CATEGORY_LABELS] ?? focusArea}`
    : `זה מתאים לעמדה ולגיל של ${player.fullName}`;
  return `מוצע כי ${player.fullName} הוא/היא ${positionLabel} בן/בת ${player.age}, ${focusText}, ולא דווחו לאחרונה עייפות או כאב.`;
}
