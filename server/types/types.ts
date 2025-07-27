export interface User {
  user_id: string;
  first_name?: string;
  last_name?: string;
  nickname: string;
  role?: 'host' | 'contestant';
  profile_color?: string;
}

export interface Game {
  game_id: string;
  name: string;
  date: string; // ISO string
  winner?: string;
  game_status?: 'planned' | 'in_progress' | 'completed';
}

export interface Question {
  id: string;
  game_id: string;
  submitted_by?: string;
  question_text: string;
  date_created: string;
  round_number?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  submitted_by?: string;
  date_created: string;
  correct: boolean;
}

export interface Guess {
  guess_id: string;
  user_id: string;
  answer_id: string;
  timestamp: string;
}

export interface UsersGames {
  ug_id: string;
  user_id: string;
  game_id: string;
  score: number;
  correct_guesses: number;
  answers_baited: number;
}

// Create an interface for request bodies if needed
export interface CreateGameBody {
  name: string;
  date: string;
  users: string[]; // user_id[]
}

export interface SubmitAnswerBody {
  questionId: string;
  answerText: string;
  submittedBy: string;
  isCorrect?: boolean;
}