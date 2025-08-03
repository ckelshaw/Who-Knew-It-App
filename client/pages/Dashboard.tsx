import { useEffect, useState } from "react";
import { Game } from '../../shared/classes/Game.ts';
import CreateGameCard from '../components/CreateGameCard';
import { PlannedGames } from "../components/PlannedGamesCard.tsx";

const AdminDashboard = () => {
  const [plannedGames, setPlannedGames] = useState<Game[]>([]);
  const [completedGames, setCompletedGames] = useState([]);

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        const gamesArray = data.map(gameData => Game.plannedFromJson(gameData));
        setPlannedGames(gamesArray);
      }
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  // const tempMethod = () => {
  //   //do stuff
  // } 

  useEffect(() => {
    fetchGames();
  }, []);

  if(plannedGames.length < 1) return <p>Loading Games...</p>

  return (
    <div className="min-h-screen bg-primary-green p-6 text-white">
      <div className="w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Card: Create Game */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 text-gray-900 shadow-md">
          <CreateGameCard />
        </div>

        {/* Bottom Left: Planned Games */}
        <div className="bg-white rounded-xl p-6 text-gray-900 shadow-md w-full">
          <PlannedGames games={plannedGames} />
        </div>

        {/* Bottom Right: Completed Games */}
        <div className="bg-white rounded-xl p-6 text-gray-900 shadow-md w-full">
          <h2 className="text-lg font-bold mb-4">Completed Games</h2>
          {completedGames.length === 0 ? (
            <p className="text-sm text-gray-500">No completed games yet.</p>
          ) : (
            <ul className="space-y-2">
              {completedGames.map((game: Game) => (
                <li key={game.game_id} className="border-b pb-2">
                  {game.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;