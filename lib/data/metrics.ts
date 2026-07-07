import type { Player, RiskFlag } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/data/task-catalog";
import {
  getAssignedTasksForPlayer,
  getTaskById,
  getOpenRiskFlagsForPlayer,
  getPlayersForCoach,
  getPlayersByTeam,
  getTeamsForCoach,
  getTeams,
  getPlayers,
  getRiskFlags,
  getCoaches,
  getRecentReportsForPlayer,
} from "@/lib/data/store";
import { WEEKLY_ENGAGEMENT_TREND } from "@/lib/data/seed";

export interface PlayerWeekProgress {
  playerId: string;
  completed: number;
  total: number;
  rate: number; // 0-100
  status: "completed" | "partial" | "not_started" | "no_plan";
}

export function getPlayerWeekProgress(playerId: string): PlayerWeekProgress {
  const tasks = getAssignedTasksForPlayer(playerId);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
  let status: PlayerWeekProgress["status"] = "no_plan";
  if (total > 0) {
    if (completed === total) status = "completed";
    else if (completed > 0 || tasks.some((t) => t.status === "started")) status = "partial";
    else status = "not_started";
  }
  return { playerId, completed, total, rate, status };
}

export interface PlayerRow {
  player: Player;
  progress: PlayerWeekProgress;
  openFlags: RiskFlag[];
  latestFatigue?: number;
  latestPain: boolean;
  needsAttention: boolean;
}

function buildPlayerRow(player: Player): PlayerRow {
  const progress = getPlayerWeekProgress(player.id);
  const openFlags = getOpenRiskFlagsForPlayer(player.id);
  const recentReports = getRecentReportsForPlayer(player.id);
  const latest = recentReports[0];
  return {
    player,
    progress,
    openFlags,
    latestFatigue: latest?.fatigue,
    latestPain: Boolean(latest?.painReported),
    needsAttention: openFlags.length > 0,
  };
}

export function getPlayerRowsForCoach(coachProfileId: string): PlayerRow[] {
  return getPlayersForCoach(coachProfileId).map(buildPlayerRow);
}

export function getPlayerRowsForTeam(teamId: string): PlayerRow[] {
  return getPlayersByTeam(teamId).map(buildPlayerRow);
}

export function getPlayerRowsForSchool(schoolId?: string): PlayerRow[] {
  return getPlayers(schoolId).map(buildPlayerRow);
}

export interface CoachDashboardStats {
  activePlayers: number;
  weeklyCompletionRate: number;
  playersNeedingAttention: number;
  painReports: number;
  highFatigueReports: number;
  noActivityPlayers: number;
  completionByTeam: { team: string; completionRate: number }[];
  categoryDistribution: { category: string; count: number }[];
  playerRows: PlayerRow[];
}

export function computeCoachDashboardStats(coachProfileId: string): CoachDashboardStats {
  const players = getPlayersForCoach(coachProfileId);
  const activePlayers = players.filter((p) => p.parentConsentStatus === "approved");
  const rows = activePlayers.map(buildPlayerRow);

  const totals = rows.reduce(
    (acc, row) => {
      acc.completed += row.progress.completed;
      acc.total += row.progress.total;
      return acc;
    },
    { completed: 0, total: 0 }
  );

  const playerIds = new Set(players.map((p) => p.id));
  const openFlags = getRiskFlags().filter((f) => playerIds.has(f.playerId) && f.status === "open");

  const teams = getTeamsForCoach(coachProfileId);
  const completionByTeam = teams.map((team) => {
    const teamRows = getPlayersByTeam(team.id)
      .filter((p) => p.parentConsentStatus === "approved")
      .map(buildPlayerRow);
    const t = teamRows.reduce(
      (acc, row) => {
        acc.completed += row.progress.completed;
        acc.total += row.progress.total;
        return acc;
      },
      { completed: 0, total: 0 }
    );
    return {
      team: team.name,
      completionRate: t.total === 0 ? 0 : Math.round((t.completed / t.total) * 100),
    };
  });

  const categoryCounts = new Map<string, number>();
  for (const row of rows) {
    const tasks = getAssignedTasksForPlayer(row.player.id);
    for (const t of tasks) {
      const task = getTaskById(t.taskId);
      if (!task) continue;
      const label = CATEGORY_LABELS[task.category];
      categoryCounts.set(label, (categoryCounts.get(label) ?? 0) + 1);
    }
  }

  return {
    activePlayers: activePlayers.length,
    weeklyCompletionRate: totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100),
    playersNeedingAttention: rows.filter((r) => r.needsAttention).length,
    painReports: openFlags.filter((f) => f.type === "pain").length,
    highFatigueReports: openFlags.filter((f) => f.type === "high_fatigue").length,
    noActivityPlayers: rows.filter((r) => r.progress.status === "not_started").length,
    completionByTeam,
    categoryDistribution: Array.from(categoryCounts.entries()).map(([category, count]) => ({
      category,
      count,
    })),
    playerRows: rows,
  };
}

export interface AdminDashboardStats {
  totalActivePlayers: number;
  activeTeams: number;
  weeklyEngagementRate: number;
  averageCompletionRate: number;
  activeCoaches: number;
  riskFlagsThisWeek: number;
  engagementByTeam: { team: string; completionRate: number }[];
  completionTrend: { label: string; completionRate: number }[];
  parentConsentRate: number;
}

export function computeAdminDashboardStats(schoolId?: string): AdminDashboardStats {
  const players = getPlayers(schoolId);
  const teams = getTeams(schoolId);
  const rows = players.map(buildPlayerRow);
  const activeRows = rows.filter((r) => r.player.parentConsentStatus === "approved");

  const totals = activeRows.reduce(
    (acc, row) => {
      acc.completed += row.progress.completed;
      acc.total += row.progress.total;
      return acc;
    },
    { completed: 0, total: 0 }
  );

  const engagedPlayers = activeRows.filter((r) => r.progress.completed > 0 || r.progress.status === "partial").length;

  const engagementByTeam = teams.map((team) => {
    const teamRows = getPlayersByTeam(team.id)
      .filter((p) => p.parentConsentStatus === "approved")
      .map(buildPlayerRow);
    const t = teamRows.reduce(
      (acc, row) => {
        acc.completed += row.progress.completed;
        acc.total += row.progress.total;
        return acc;
      },
      { completed: 0, total: 0 }
    );
    return {
      team: team.name,
      completionRate: t.total === 0 ? 0 : Math.round((t.completed / t.total) * 100),
    };
  });

  const approvedConsentCount = players.filter((p) => p.parentConsentStatus === "approved").length;

  return {
    totalActivePlayers: activeRows.length,
    activeTeams: teams.length,
    weeklyEngagementRate:
      activeRows.length === 0 ? 0 : Math.round((engagedPlayers / activeRows.length) * 100),
    averageCompletionRate: totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100),
    activeCoaches: getCoaches(schoolId).length,
    riskFlagsThisWeek: getRiskFlags(schoolId).filter((f) => f.status === "open").length,
    engagementByTeam,
    completionTrend: WEEKLY_ENGAGEMENT_TREND.map((w) => ({ label: w.label, completionRate: w.completionRate })),
    parentConsentRate: players.length === 0 ? 0 : Math.round((approvedConsentCount / players.length) * 100),
  };
}
