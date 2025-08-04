import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";
import { CreateGameBody, Game } from "../types/types";


export const createGame = async (req: Request, res: Response) => {
  
  const gameData = req.body;

  try {
    const { data, error } = await supabase.rpc('insert_full_game', {
      game_data: gameData,
    });

    if (error) {
      console.error('Supabase RPC error:', error.message);
      return res.status(500).json({ error: 'Failed to save game to database.' });
    }

    return res.status(201).json({ game_id: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  const { game_id } = req.params;
  console.log(game_id);

  try {
    const { data, error } = await supabase.rpc("get_full_game", {
      game_uuid: game_id, // MUST match function parameter name
    });

    if (error) return res.status(500).json({ error: error.message });

    return res.json(data);
  } catch (err) {
    console.error("Failed to fetch game: ", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const listGames = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("planned_games_view")
    .select("*");
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const updateGameStatus = async (
  req: Request<{ id: string }, {}, { status: Game["game_status"] }>,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const { error } = await supabase
    .from("games")
    .update({ game_status: status })
    .eq("game_id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Status updated" });
};
