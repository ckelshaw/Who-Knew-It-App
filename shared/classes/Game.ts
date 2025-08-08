import { User } from "./User";
import { Question } from "./Question";

export type GameStatus = "Planned" | "Completed" | "In Progress";

function userFromJson(u: any): User {
    return new User(u.user_id, u.first_name, u.last_name, u.nickname, u.role);
  }

export class Game {
  private _game_id: string;
  private _name: string;
  private _date?: string;
  private _winners: User[] | null;
  private _game_status: GameStatus;
  private _created_at: string;
  private _contestants: User[];
  private _questions: Question[];
  private _currentRound?: number = 0;

  constructor(
    game_id: string = "temp",
    name: string = "",
    date: string = "",
    winners: User[] | null = null,
    game_status: GameStatus = "Planned",
    created_at: string = new Date().toISOString(),
    contestants: User[] = [],
    questions: Question[] = [],
    current_round: number = 0
  ) {
    this._game_id = game_id;
    this._name = name;
    this._date = date;
    this._winners = winners;
    this._game_status = game_status;
    this._created_at = created_at;
    this._contestants = contestants;
    this._questions = questions;
    this._currentRound = current_round;
  }

  // #region Getters Setters
  public get game_id(): string {
    return this._game_id;
  }
  public set game_id(value: string) {
    this._game_id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get date(): string | undefined {
    return this._date;
  }
  public set date(value: string) {
    this._date = value;
  }
  public get winners(): User[] | null {
    return this._winners;
  }
  public set winners(value: User[] | null) {
    this._winners = value;
  }
  public get game_status(): GameStatus {
    return this._game_status;
  }
  public set game_status(value: GameStatus) {
    this._game_status = value;
  }
  public get created_at(): string {
    return this._created_at;
  }
  public set created_at(value: string) {
    this._created_at = value;
  }
  public get contestants(): User[] {
    return this._contestants;
  }
  public set contestants(value: User[]) {
    this._contestants = value;
  }
  public get questions(): Question[] {
    return this._questions;
  }
  public set questions(value: Question[]) {
    this._questions = value;
  }
  public get currentRound(): number | undefined {
    return this._currentRound;
  }
  public set currentRound(value: number) {
    this._currentRound = value;
  }

  // #endregion

  copyWith(partial: Partial<Game>): Game {
    return new Game(
      partial["game_id"] ?? this._game_id,
      partial["name"] ?? this._name,
      partial["date"] ?? this._date,
      partial["winners"] ?? this._winners,
      partial["game_status"] ?? this._game_status,
      partial["created_at"] ?? this._created_at,
      partial["contestants"] ?? [...this._contestants],
      partial["questions"] ?? [...this._questions],
      partial["currentRound"] ?? this._currentRound
    );
  }

  static plannedFromJson(obj: any): Game {
    return new Game(
      obj.game_id,
      obj.game_name,
      obj.date,
      null,
      obj.game_status,
      obj.created_at,
      obj.contestants
        ? obj.contestants.map(
            (u: any) =>
              new User(u.user_id, u.first_name, u.last_name, u.nickname, u.role)
          )
        : [],
      [],
      0
    );
  }

static completedFromJson(obj: any): Game {
  const contestants: User[] = (obj.contestants ?? []).map(userFromJson);

  // Normalize winners: prefer array if present; else wrap single winner; else []
  const winnersArray: User[] = (obj.winners ?? [])
    .map(userFromJson);

  if (!winnersArray.length && obj.winner) {
    winnersArray.push(userFromJson(obj.winner));
  }

  return new Game(
    obj.game_id,
    obj.game_name,
    obj.date,
    winnersArray.length ? winnersArray : null, // null if none
    obj.game_status,
    obj.created_at,
    contestants,
    [],                                        // questions if provided
    0
  );
}

  // addUser(user: User) {
  //   this.users.set(user.userId, user);
  // }

  // submitAnswer(answer: Answer) {
  //   this.answers.push(answer);
  // }

  // recordGuess(guesserId: string, guessedAnswerId: string) {
  //   const guessedAnswer = this.answers.find((a) => a.answerId === guessedAnswerId);
  //   const guesser = this.users.get(guesserId);

  //   if (!guessedAnswer || !guesser) return;

  //   if (guessedAnswer.isCorrect) {
  //     guesser.incrementScore();
  //     guesser.recordCorrectGuess();
  //   } else {
  //     guesser.incrementScore(); // still gets a point for any guess?
  //     const baitedUser = this.users.get(guessedAnswer.userId);
  //     if (baitedUser) {
  //       baitedUser.incrementScore();
  //       baitedUser.recordBaitedGuess();
  //     }
  //   }
  // }

  // startNextRound() {
  //   this.currentRound++;
  //   this.answers = [];
  // }

  // getScores() {
  //   return Array.from(this.users.values()).map((u) => ({
  //     nickname: u.nickname,
  //     score: u.score,
  //     correctGuesses: u.correctGuesses,
  //     answersBaited: u.answersBaited,
  //   }));
  // }

  // endGame() {
  //   // Cleanup or persist to DB later
  // }
}
