import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";
import { CreateGameBody, Game } from "../types/types";

export const createGame = async (
  req: Request<{}, {}, CreateGameBody>,
  res: Response
) => {
  try {
    const { name, date, users } = req.body;

    const { data: game, error } = await supabase
      .from("games")
      .insert({ name, date, game_status: "planned" })
      .select()
      .single();

    if (error || !game) return res.status(500).json({ error: error?.message });

    // Add users to Users_Games join table
    const userRows = users.map((user_id) => ({
      user_id,
      game_id: game.game_id,
      score: 0,
      correct_guesses: 0,
      answers_baited: 0,
    }));

    const { error: ugError } = await supabase
      .from("users_games")
      .insert(userRows);
    if (ugError) return res.status(500).json({ error: ugError.message });

    return res.status(201).json({ message: "Game created", game });
  } catch (err) {
    return res.status(500).json({ error: "Error creating game" });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("game_id", id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const listGames = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("games")
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
