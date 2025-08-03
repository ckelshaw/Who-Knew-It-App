import { Answer } from "./Answer";

export class Question {
  private _id: string;
  private _game_id: string;
  private _question_text: string;
  private _submitted_by: string;
  private _round_number?: number;
  private _date_created: string;
  private _answers: Answer[];
  private _notes: string;

  constructor(
    id: string,
    game_id: string,
    question_text: string,
    submitted_by: string,
    date_created: string,
    answer: Answer[],
    notes: string,
    round_number?: number
  ) {
    this._id = id;
    this._game_id = game_id;
    this._question_text = question_text;
    this._submitted_by = submitted_by;
    this._round_number = round_number;
    this._date_created = date_created;
    this._answers = answer;
    this._notes = notes;
  }

  // #region Getters Setters

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }
  get game_id(): string {
    return this._game_id;
  }
  set game_id(value: string) {
    this._game_id = value;
  }
  get question_text(): string {
    return this._question_text;
  }
  set question_text(value: string) {
    this._question_text = value;
  }
  get submitted_by(): string {
    return this._submitted_by;
  }
  set submitted_by(value: string) {
    this._submitted_by = value;
  }
  get date_created(): string {
    return this._date_created;
  }
  set date_created(value: string) {
    this._date_created = value;
  }
  get round_number(): number | undefined {
    return this._round_number;
  }
  set round_number(value: number) {
    this._round_number = value;
  }
  public get answers(): Answer[] {
    return this._answers;
  }
  public set answers(value: Answer[]) {
    this._answers = value;
  }
  public get notes(): string {
    return this._notes;
  }
  public set notes(value: string) {
    this._notes = value;
  }
  // #endregion

  copyWith(partial: Partial<Question>): Question {
  return new Question(
    partial.id ?? this._id,
    partial.game_id ?? this._game_id,
    partial.question_text ?? this._question_text,
    partial.submitted_by ?? this._submitted_by,
    partial.date_created ?? this._date_created,
    partial.answers ?? [...this._answers],
    partial.notes ?? this._notes,
    partial.round_number ?? this._round_number
  );
}
}
