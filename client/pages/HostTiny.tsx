import React, { useEffect, useState } from "react";
import { useSocket } from "../src/socket/socket-context";

const HostTiny = ({ gameId }: {gameId: string }) => {
  const socket = useSocket();
  const [answers, setAnswers] = useState<Array<{ userId: string; text: string }>>([]);

  useEffect(() => {
    if (!socket) return;

    const onRoundStarted = (p: { questionId: string; round: number }) => {
      console.log("Round started", p);
      setAnswers([]);
    };

    const onAnswer = (p: {
      questionId: string;
      userId: string;
      text: string;
    }) => {
      setAnswers((a) => [...a, { userId: p.userId, text: p.text }]);
    };

    socket.on("round_started", onRoundStarted);
    socket.on("answer_submitted", onAnswer);

    return () => {
      socket.off("round_started", onRoundStarted);
      socket.off("answer_submitted", onAnswer);
    };
  }, [socket]);

  const startRound = () => {
    const questionId = "Q1";
    socket?.emit("start_round", { gameId, questionId, round: 1 });
  };

  return (
    <div>
      <button onClick={startRound}>Start Round</button>
      <h3>Incoming Answers</h3>
      <ul>
        {answers.map((a, i) => (
          <li key={i}>
            {a.userId}: {a.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostTiny;