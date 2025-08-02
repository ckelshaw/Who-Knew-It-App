export class Answer {
  private _id: string;
  private _question_id: string;
  private _answer_text: string;
  private _submitted_by: string;
  private _correct: boolean;
  private _date_created: string;

  constructor(
    id: string,
    question_id: string,
    answer_text: string,
    submitted_by: string,
    correct: boolean,
    date_created: string
  ) {
    this._id = id;
    this._question_id = question_id;
    this._answer_text = answer_text;
    this._submitted_by = submitted_by;
    this._correct = correct;
    this._date_created = date_created;
  }

  // #region Getters Setters
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get question_id(): string {
    return this._question_id;
  }
  public set question_id(value: string) {
    this._question_id = value;
  }
  public get answer_text(): string {
    return this._answer_text;
  }
  public set answer_text(value: string) {
    this._answer_text = value;
  }
  public get submitted_by(): string {
    return this._submitted_by;
  }
  public set submitted_by(value: string) {
    this._submitted_by = value;
  }
  public get correct(): boolean {
    return this._correct;
  }
  public set correct(value: boolean) {
    this._correct = value;
  }
  public get date_created(): string {
    return this._date_created;
  }
  public set date_created(value: string) {
    this._date_created = value;
  }

  //#endregion



}
