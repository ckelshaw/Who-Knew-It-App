import { Game } from './Game';

export class GameManager {
  games: Map<string, Game>;

  constructor() {
    this.games = new Map();
  }

  createGame(gameId: string): Game {
    const game = new Game(gameId);
    this.games.set(gameId, game);
    return game;
  }

  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  deleteGame(gameId: string) {
    this.games.delete(gameId);
  }

  getActiveGames(): string[] {
    return Array.from(this.games.keys());
  }
}