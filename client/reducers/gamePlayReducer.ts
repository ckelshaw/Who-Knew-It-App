import { User } from '../../shared/classes/User';
import { Game } from '../../shared/classes/Game';
import { Answer } from '../../shared/classes/Answer';
import type { GuessRecord, FakeAnswer } from '../src/types/GuessRecord'


type GameAction = 
    | { type: "SET_GAME"; payload: Game }
    | { type: "SUBMIT_FAKE_ANSWER"; payload: FakeAnswer }
    | { type: "GUESS_ANSWER"; payload: GuessRecord[] }
    | { type: "ADVANCE_ROUND"; }
    | { type: "SET_CURRENT_ROUND"; payload: number }
    | { type: "CALCULATE_WINNER"}
    | { type: "END_GAME" };

export const initialGameState = new Game();

function cloneUser(u: User): User {
  const nu = new User(
    u.userId ?? '',
    u.firstName ?? '',
    u.lastName ?? '',
    u.nickname ?? '',
    u.role ?? ''
  );
  nu.score = u.score;
  nu.correctGuesses = u.correctGuesses;
  nu.answersBaited = u.answersBaited;
  return nu;
}

function updateUser(
  users: Map<string, User>,
  userId: string,
  fn: (u: User) => void
) {
  const u = users.get(userId);
  if (!u) return;                 // not found (e.g., House)
  const cloned = cloneUser(u);
  fn(cloned);
  users.set(userId, cloned);
}

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
      case "SUBMIT_FAKE_ANSWER": {
        const fakeAnswer = action.payload;

        const newAnswer = new Answer(
          fakeAnswer.id,
          fakeAnswer.question_id,
          fakeAnswer.answer_text,
          fakeAnswer.user_id || "",
          false,
          new Date().toISOString(),
          ""
        );

        const updatedQuestions = state.questions.map((q) =>
          q.id === fakeAnswer.question_id
            ? q.copyWith({ answers: [...q.answers, newAnswer] })
            : q
        );

        return state.copyWith({ questions: updatedQuestions });
      }
      case "GUESS_ANSWER": {
        const guesses = action.payload;

        const usersMap = new Map<string, User>();
        state.contestants.forEach((u) => usersMap.set(u.userId, u));

        for (const g of guesses) {
          const q = state.questions.find((q) => q.id === g.question_id);
          if (!q) continue;

          const ans = q.answers.find((a) => a.id === g.answer_id);
          if (!ans) continue;

          const guesserId = g.chosen_by;
          const submitterId = ans.submitted_by;

          if (ans.correct) {
            updateUser(usersMap, guesserId, (u) => {
              u.score = u.score + 1;
              u.correctGuesses = u.correctGuesses + 1;
            });
          } else {
            if (usersMap.has(submitterId)) {
              updateUser(usersMap, submitterId, (u) => {
                u.score = u.score + 1;
                u.answersBaited = u.answersBaited + 1;
              });
            }
          }
        }
        const updatedContestants = state.contestants.map(
          (u) => usersMap.get(u.userId) ?? u
        );
        console.log("Users: ", updatedContestants);
        return state.copyWith({ contestants: updatedContestants });
      }
      case "ADVANCE_ROUND": {
        const nextRound =
          state.currentRound === null || state.currentRound === undefined
            ? 1
            : state.currentRound + 1;
        return state.copyWith({ currentRound: nextRound });
      }
      case "SET_CURRENT_ROUND": {
        return state.copyWith({ currentRound: action.payload });
      }
      case "CALCULATE_WINNER": {
        if (!state.contestants.length) return state;
        const max = Math.max(...state.contestants.map((c) => c.score));
        const winners = state.contestants.filter((c) => c.score === max);
        return state.copyWith({ winners });
      }
      case "END_GAME":
        return state.copyWith({ game_status: "Completed" });
      default:
        return state;
    }
}