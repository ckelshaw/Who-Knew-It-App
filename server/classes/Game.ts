import { User } from './User';

type Answer = {
  answerId: string;
  userId: string;
  text: string;
  isCorrect: boolean;
};

export class Game {
  gameId: string;
  users: Map<string, User>;
  questions: string[] = [];
  currentRound: number = 0;
  answers: Answer[] = [];

  constructor(gameId: string) {
    this.gameId = gameId;
    this.users = new Map();
  }

  addUser(user: User) {
    this.users.set(user.userId, user);
  }

  submitAnswer(answer: Answer) {
    this.answers.push(answer);
  }

  recordGuess(guesserId: string, guessedAnswerId: string) {
    const guessedAnswer = this.answers.find((a) => a.answerId === guessedAnswerId);
    const guesser = this.users.get(guesserId);

    if (!guessedAnswer || !guesser) return;

    if (guessedAnswer.isCorrect) {
      guesser.incrementScore();
      guesser.recordCorrectGuess();
    } else {
      guesser.incrementScore(); // still gets a point for any guess?
      const baitedUser = this.users.get(guessedAnswer.userId);
      if (baitedUser) {
        baitedUser.incrementScore();
        baitedUser.recordBaitedGuess();
      }
    }
  }

  startNextRound() {
    this.currentRound++;
    this.answers = [];
  }

  getScores() {
    return Array.from(this.users.values()).map((u) => ({
      nickname: u.nickname,
      score: u.score,
      correctGuesses: u.correctGuesses,
      answersBaited: u.answersBaited,
    }));
  }

  endGame() {
    // Cleanup or persist to DB later
  }
}