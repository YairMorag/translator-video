import { requireProfile } from "@/lib/auth/session";
import { AssignTaskFlow } from "@/components/assign-task-flow";
import { getTeamsForCoach, getPlayersForCoach, getTaskCatalog, getRecentReportsForPlayer } from "@/lib/data/store";
import type { TaskReport } from "@/lib/types";

export default async function AssignTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string; playerId?: string }>;
}) {
  const profile = await requireProfile("coach");
  const { teamId, playerId } = await searchParams;

  const teams = getTeamsForCoach(profile.id);
  const players = getPlayersForCoach(profile.id);
  const taskCatalog = getTaskCatalog();

  const recentReportsByPlayer: Record<string, TaskReport[]> = {};
  for (const player of players) {
    recentReportsByPlayer[player.id] = getRecentReportsForPlayer(player.id);
  }

  const resolvedTeamId = teamId ?? players.find((p) => p.id === playerId)?.teamId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assign Weekly Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suggestions come from a simple, transparent rules engine. You always review and approve before a player sees anything.
        </p>
      </div>

      <AssignTaskFlow
        teams={teams}
        players={players}
        taskCatalog={taskCatalog}
        recentReportsByPlayer={recentReportsByPlayer}
        defaultTeamId={resolvedTeamId}
        defaultPlayerId={playerId}
      />
    </div>
  );
}
