import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const createUser = async (req: Request, res: Response) => {
  const { nickname } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert({ nickname })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

export const listUsers = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const getUserStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users_games")
    .select("score, correct_guesses, answers_baited, game_id")
    .eq("user_id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};
