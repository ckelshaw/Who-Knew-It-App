import { Question } from '../../shared/classes/Question';
import { User } from '../../shared/classes/User';
import { Game } from '../../shared/classes/Game';

type GameAction = 
    | { type: "SET_GAME"; payload: Game }
    | { type: "SUBMIT_FAKE_ANSWER"; payload: Question }
    | { type: "GUESS_ANSWER"; payload: Question }
    | { type: "ADVANCE_ROUND"; }
    | { type: "CALCULATE_WINNER"; payload: User};

export const initialGameState = new Game();

export const gamePlayReducer = (state: Game, action: GameAction): Game => {
    switch (action.type) {
      case "SET_GAME":
        return new Game(
          action.payload.game_id,
          action.payload.name,
          action.payload.date,
          null,
          action.payload.game_status,
          action.payload.created_at,
          action.payload.contestants,
          action.payload.questions,
          action.payload.currentRound
        );
      case "SUBMIT_FAKE_ANSWER":
        return state.copyWith({
          questions: [...state.questions, action.payload],
        });
      case "GUESS_ANSWER":
        return state.copyWith({
          questions: [...state.questions, action.payload],
        });
      case 'ADVANCE_ROUND': {
        const nextRound = (state.currentRound === null || state.currentRound === undefined) ? 1 : state.currentRound + 1;
        return state.copyWith({ currentRound: nextRound });
      }
      case 'CALCULATE_WINNER':
        return state.copyWith({ winner: action.payload });
      default:
        return state;
    }
}