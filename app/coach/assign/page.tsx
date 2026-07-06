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
        <h1 className="text-2xl font-semibold tracking-tight">הקצאת משימות שבועיות</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ההצעות מגיעות ממנוע חוקים פשוט ושקוף. אתם תמיד בודקים ומאשרים לפני שהשחקן רואה משהו.
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
