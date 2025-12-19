import type { GuessRecord } from "../../client/src/types/GuessRecord";

export type Role = "host" | "contestant";

export interface ServerToClientEvents {
    connected: (data: { userId: string; role: Role; gameId: string }) => void;
    round_started: (data: { gameId: string; questionId: string; round: number }) => void;
    answer_submitted: (data: { questionId: string; userId: string; text: string, answerId: string }) => void;
    room_state: (data: { gameId: string; state: { currentRound: number, questions: Array<{ id: string }> }}) => void;
    scores_update: (data: { gameId: string, guesses: GuessRecord[] }) => void;
    moved_next_round: (data: { gameId: string, currentRound: number }) => void;
    all_answers_in: (data: { gameId: string, questionId: string }) => void;
    answers_locked_in: (data: { gameId: string, questionId: string }) => void;
    reveal_answer: (data: { gameId: string, questionId: string, answerId: string }) => void;
    reveal_writer: (data: { gameId: string, questionId: string, answerId: string }) => void;
}

export interface ClientToServerEvents {
    join_game: (data: { gameId: string }) => void;
    start_round: (data: { gameId: string; questionId: string; round: number }) => void;
    submit_fake_answer: (data: { questionId: string; text: string, numContestants: number, answerId: string }) => void;
    request_room_state: (data: { gameId: string }) => void;
    register_game: (data: { gameId: string, currentRound: number, questions: Array<{id: string}> }) => void;
    score_round: (data: { gameId: string, guesses: GuessRecord[] }) => void;
    next_round: (data: { gameId: string, currentRound: number }) => void;
    lock_in_answers: (data: { gameId: string, questionId: string }) => void;
    show_answer_to_contestant: (data: { gameId: string, questionId: string, answerId: string }) => void;
    show_writer_to_contestant: (data: { gameId: string, questionId: string, answerId: string }) => void;
}