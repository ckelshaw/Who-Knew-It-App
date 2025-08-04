import Badge from "./ui/Badge";
//import { Label } from "./ui/label";
import { Calendar, Users } from "lucide-react";
import { Game } from "../../shared/classes/Game";
import { useNavigate } from "react-router-dom";

interface PlannedGamesProps {
  games: Game[];
  //onCompleteGame: (gameId: string, winner: string) => void;
}

export function PlannedGames({ games }: PlannedGamesProps) {
  const navigate = useNavigate();

  const navigateToGame = async (game_id: string) => {
    console.log("Game id: ", game_id);
    navigate(`/host/waiting-room/${game_id}`);
  };

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h2 className="mb-8">Planned Games</h2>

        {games.length === 0 ? (
          <p className="text-muted-foreground py-8">
            No planned games yet. Create one above!
          </p>
        ) : (
          <div className="space-y-6">
            {games.map((game, index) => (
              <div
                key={game.game_id}
                className="pb-6 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-medium min-w-[2rem] text-center">
                        {index + 1}
                      </div>
                      <h3>{game.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Planned
                    </Badge>
                    <Badge
                      variant="clickable"
                      className="text-xs"
                      onClick={() => navigateToGame(game.game_id)}
                    >
                      Play Game!
                    </Badge>
                  </div>

                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        Contestants:{" "}
                        {game.contestants.map((c) => c.firstName).join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {game.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
