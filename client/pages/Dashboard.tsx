import { useEffect, useState } from "react";
import type { Game } from '../../shared/types/types.ts';
import CreateGameCard from '../components/CreateGameCard';

const AdminDashboard = () => {
  const [plannedGames, setPlannedGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  // const [title, setTitle] = useState("");

  // const handleCreateGame = async () => {
  //   if (!title) return;
  //   try {
  //     const res = await fetch("http://localhost:5050/api/games", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ title }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       setTitle("");
  //       fetchGames(); // Refresh lists
  //     } else {
  //       console.error(data.error);
  //     }
  //   } catch (err) {
  //     console.error("Error creating game", err);
  //   }
  // };

  const fetchGames = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/games");
      const data = await res.json();
      if (res.ok) {
        setPlannedGames(data.filter((g: Game) => g.game_status === "planned"));
        setCompletedGames(data.filter((g: Game) => g.game_status === "completed"));
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

  return (
    <div className="min-h-screen bg-primary-green p-6 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Card: Create Game */}
        <div className="col-span-8 lg:col-span-24 bg-white rounded-xl p-6 text-gray-900 shadow-md">
            <CreateGameCard />
        </div>
        {/* <div className="col-span-8 lg:col-span-24 bg-white rounded-xl p-6 text-gray-900 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-600">Create a New Game</h2>
          <div className="flex flex-col sm:flex-row gap-2 justify-items-center">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-2/3"
              placeholder="Game Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={handleCreateGame}
              className="bg-primary-green hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              Create Game
            </button>
          </div>
        </div> */}

        {/* Bottom Left: Planned Games */}
        <div className="bg-white rounded-xl p-6 text-gray-900 shadow-md">
          <h2 className="text-lg font-bold mb-4">Planned Games</h2>
          {plannedGames.length === 0 ? (
            <p className="text-sm text-gray-500">No planned games yet.</p>
          ) : (
            <ul className="space-y-2">
              {plannedGames.map((game: Game) => (
                <li key={game.game_id} className="border-b pb-2">
                  {game.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Right: Completed Games */}
        <div className="bg-white rounded-xl p-6 text-gray-900 shadow-md">
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