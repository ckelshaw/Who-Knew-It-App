import React, { useEffect, useState } from "react";
import { useSocket } from "../src/socket/socket-context";

const ContestantTiny = () => {
  const socket = useSocket();
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("contestant useEffect");
    if (!socket) {
        console.log("no socket!");
        return;
    } 

    const onRoundStarted = (p: { questionId: string }) => {
        console.log("contestant round started!");
        setQuestionId(p.questionId);
    }

    socket.on("round_started", onRoundStarted);

    return () => {
        socket.off("round_started", onRoundStarted);
    };
  }, [socket]);

  const submit = () => {
    if (!questionId) return;
    socket?.emit("submit_fake_answer", { questionId, text });
    setText("");
  };

  return (
    <div>
      <div>Question: {questionId ?? "waiting..."}</div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Your answer" />
      <button onClick={submit} disabled={!questionId}>Send</button>
    </div>
  );
};

export default ContestantTiny;