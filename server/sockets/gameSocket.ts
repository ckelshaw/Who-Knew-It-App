import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from '../../shared/types/socketTypes';
import { GameManager } from '../../shared/classes/GameManager';
import type { GuessRecord } from '../../client/src/types/GuessRecord';
import { utilFunctions } from '../utils/utilFunctions';

type HandShakeAuth = { userId?: string; role?: "host" | "contestant"; gameId?: string };

export function createSocketServer(httpServer: any) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: ["http://localhost:5173"], credentials: true },
    path: "/socket.io",
    transports: ["polling", "websocket"],
  });

  io.use((socket, next) => {
    console.log("[server] handshake.auth = ", socket.handshake.auth);
    const auth = (socket.handshake.auth || {}) as HandShakeAuth;
    if(!auth.userId || !auth.role || !auth.gameId) return next(new Error("missing_auth"));
    socket.data = { userId: auth.userId, role: auth.role, gameId: auth.gameId };
    next();
  });

  const games: Record<string, { currentRound: number, questions: Array<{ id: string }> }> = {};
  const answersByQ: Record<string, Set<string>> = {}; //Keep track of how many answers have been submitted per question

  io.on("connection", (socket) => {
    const { userId, role, gameId } = socket.data as { userId: string; role: "host" | "contestant"; gameId: string };

    socket.join(gameId);
    socket.emit("connected", { userId, role, gameId });

    socket.on("register_game", ({ gameId, currentRound, questions }) => {
      games[gameId] = { currentRound, questions };
      console.log("[server] registered game", gameId, games[gameId]);
    });

    socket.onAny((ev, ...args) => console.log(`[recv] ${userId} ${ev}`, args));
    //acknowledge client's join
    socket.on("join_game", ({ gameId: gid }) => {
      if(gid !== gameId) return;
      console.log(`[join_game] ${userId} in ${gameId}`);
    });
    //host starts a round, broadcast to the room
    socket.on("start_round", ({ gameId, questionId }) => {
      const g = games[gameId] ?? (games[gameId] = { currentRound: 0, questions: [] });
      g.currentRound = g.currentRound + 1 || 1; // increment or start at 1
      io.to(gameId).emit("round_started", { gameId, questionId, round: g.currentRound });
    });

    socket.on("submit_fake_answer", ({ questionId, text, numContestants, answerId }) => {
      //TODO: write to game object/DB

      io.to(gameId).emit("answer_submitted", { questionId, userId, text, answerId });
      console.log("answer submitted, ", questionId, userId, text, answerId);

      (answersByQ[questionId] ??= new Set()).add(userId);

      if (answersByQ[questionId].size >= numContestants) {
        io.to(gameId).emit("all_answers_in", { gameId, questionId });
      }

    });

    socket.on("request_room_state", ({ gameId }) => {
      const g = games[gameId];
      console.log("Game", games);
      console.log("game", g);
      if (!g) return;
      socket.emit("room_state", { gameId, state: g });
    });

    socket.on("score_round", ({ gameId, guesses }: { gameId: string; guesses: GuessRecord[] }) => {
      const { role } = socket.data as { role: "host" | "contestant" };
      console.log(role);
      if (role !== "host") return;                    // only host may publish scores
      io.to(gameId).emit("scores_update", { gameId, guesses });
      console.log("scores updated!");
    });

    socket.on("next_round", ({ gameId, currentRound }) => {
      const g = games[gameId];
      g.currentRound = g.currentRound + 1;
      io.to(gameId).emit("moved_next_round", ({ gameId, currentRound: g.currentRound }))
    });

    socket.on("lock_in_answers", ({ gameId, questionId }) => {
      io.to(gameId).emit("answers_locked_in", { gameId, questionId });
    });

    socket.on("show_answer_to_contestant", ({ gameId, questionId, answerId }) => {
      io.to(gameId).emit("reveal_answer", { gameId, questionId, answerId });
    })

    socket.on("show_writer_to_contestant", ({ gameId, questionId, answerId }) => {
      io.to(gameId).emit("reveal_writer", { gameId, questionId, answerId });
    })

  });

  return io;

}