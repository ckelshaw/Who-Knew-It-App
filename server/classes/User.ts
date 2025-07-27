export class User {
  userId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  score: number = 0;
  correctGuesses: number = 0;
  answersBaited: number = 0;

  constructor(userId: string, firstName: string, lastName: string, nickname: string) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickname = nickname;
  }

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