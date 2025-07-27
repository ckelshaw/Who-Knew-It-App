import { Server } from "socket.io";
import { GameManager } from "../classes/GameManager";

const gameManager = new GameManager();

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_game", ({ gameId, userId }) => {
      socket.join(gameId);
      console.log(`${userId} joined game ${gameId}`);
    });

    socket.on("submit_fake_answer", ({ gameId, answer }) => {
      const game = gameManager.getGame(gameId);
      game?.submitAnswer(answer);
      io.to(gameId).emit("new_fake_answer", answer);
    });

    // more handlers...
  });
};