import { Request, Response } from 'express';
import { supabase } from '../db/supabaseClient';
import { Question } from '../types/types';

export const addQuestion = async (req: Request<{}, {}, Partial<Question>>, res: Response) => {
  const { question_text, game_id, submitted_by, round_number } = req.body;

  const { data, error } = await supabase
    .from('questions')
    .insert({
      question_text,
      game_id,
      submitted_by,
      date_created: new Date().toISOString(),
      round_number,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

export const getQuestionsForGame = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('game_id', gameId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};