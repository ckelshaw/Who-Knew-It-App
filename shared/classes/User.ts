export class User {
  private _user_id: string;
  private _first_name: string;
  private _last_name: string;
  private _nickname: string;
  private _score: number = 0;
  private _correctGuesses: number = 0;
  private _answersBaited: number = 0;
  private _role?: string = 'contestant';

  constructor(user_id: string, first_name: string, last_name: string, nickname: string, role: string) {
    this._user_id = user_id;
    this._first_name = first_name;
    this._last_name = last_name;
    this._nickname = nickname;
    this._role = role;
  }

  // #region Getters Setters
  public get userId(): string {
    return this._user_id;
  }
  public set userId(value: string) {
    this._user_id = value;
  }

  public get firstName(): string {
    return this._first_name;
  }
  public set firstName(value: string) {
    this._first_name = value;
  }
  public get lastName(): string {
    return this._last_name;
  }
  public set lastName(value: string) {
    this._last_name = value;
  }
  public get nickname(): string {
    return this._nickname;
  }
  public set nickname(value: string) {
    this._nickname = value;
  }
  public get score(): number {
    return this._score;
  }
  public set score(value: number) {
    this._score = value;
  }
  public get correctGuesses(): number {
    return this._correctGuesses;
  }
  public set correctGuesses(value: number) {
    this._correctGuesses = value;
  }
  public get answersBaited(): number {
    return this._answersBaited;
  }
  public set answersBaited(value: number) {
    this._answersBaited = value;
  }
  public get role(): string | undefined {
    return this._role;
  }
  public set role(value: string | undefined) {
    this._role = value;
  }
  public get concattedName(): string {
    return this._nickname
      ? `${this._first_name} "${this._nickname}" ${this._last_name}`
      : `${this._first_name} ${this._last_name}`;
  }

  public get initials(): string {
    return `${this._first_name[0]}${this._last_name[0]}`;
  }
  //#endregion


  incrementScore() {
    this.score++;
  }

  recordCorrectGuess() {
    this.correctGuesses++;
  }

  recordBaitedGuess() {
    this.answersBaited++;
  }

  resetStats() {
    this.score = 0;
    this.correctGuesses = 0;
    this.answersBaited = 0;
  }
}