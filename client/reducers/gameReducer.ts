import { User } from "../../shared/classes/User";
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
import { Game, type GameStatus } from "../../shared/classes/Game";

type GameAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_STATUS"; payload: GameStatus }
  | { type: "SET_DATE"; payload: string }
  | { type: "ADD_CONTESTANT"; payload: User }
  | { type: "REMOVE_CONTESTANT"; payload: string }
  | { type: "ADD_QUESTION"; payload: Question }
  | { type: "ADD_ANSWER_TO_QUESTION"; payload: Answer }
  | { type: "RESET_GAME"; payload: string };

export const initialGameState = new Game();

export const gameReducer = (state: Game, action: GameAction): Game => {
  switch (action.type) {
    case "SET_NAME":
      return state.copyWith({ name: action.payload });
    case "SET_STATUS":
      return state.copyWith({ game_status: action.payload });
    case "SET_DATE":
      return state.copyWith({ date: action.payload });
    case "ADD_CONTESTANT":
      return state.copyWith({
        contestants: [...state.contestants, action.payload],
      });
    case "REMOVE_CONTESTANT":
      return state.copyWith({
        contestants: state.contestants.filter(
          (u) => u.userId !== action.payload
        ),
      });
    case "ADD_QUESTION":
      return state.copyWith({
        questions: [...state.questions, action.payload],
      });
    case "ADD_ANSWER_TO_QUESTION":
      return state.copyWith({
        questions: state.questions.map((q) =>
          q.id === action.payload.question_id
            ? q.copyWith({ answers: [...q.answers, action.payload] })
            : q
        ),
      });
    case "RESET_GAME":
      return initialGameState;

    default:
      return state;
  }
};
