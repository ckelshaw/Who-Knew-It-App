import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";
import { SubmitAnswerBody } from "../types/types";

export const submitAnswer = async (
  req: Request<{}, {}, SubmitAnswerBody>,
  res: Response
) => {
  const { questionId, answerText, submittedBy, isCorrect = false } = req.body;

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id: questionId,
      answer_text: answerText,
      submitted_by: submittedBy,
      date_created: new Date().toISOString(),
      correct: isCorrect,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

export const getAnswersForQuestion = async (req: Request, res: Response) => {
  const { questionId } = req.params;
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const recordGuess = async (req: Request, res: Response) => {
  const { guesserId, answerId } = req.body;

  const { error } = await supabase.from("guesses").insert({
    user_id: guesserId,
    answer_id: answerId,
    timestamp: new Date().toISOString(),
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Guess recorded" });
};
