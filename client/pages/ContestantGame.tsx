import { useReducer, useEffect, useState, useMemo } from "react";
import ContestantQuestionDisplay from "../components/ContestantQuestionDisplay";
import ContestantAnswerDisplay from '../components/ContestantAnswerDisplay';
import ScoreBanner from "../components/ScoreBanner";
import { User } from "../../shared/classes/User";
import { Answer } from '../../shared/classes/Answer';
import { Question } from '../../shared/classes/Question';
import { Game } from '../../shared/classes/Game';
import { useParams } from 'react-router-dom';
import { gamePlayReducer, initialGameState } from '../reducers/gamePlayReducer';
import type { GuessRecord, FakeAnswer } from "../src/types/GuessRecord";
import { useSocket } from '../src/socket/socket-context';

type incomingUser = {
    id: string,
    first_name: string,
    last_name: string,
    nickname: string,
    role: string
};

const ContestantGame = () => {
    const socket = useSocket();
    const { game_id, user_id } = useParams();
    const [game, dispatch] = useReducer(gamePlayReducer, initialGameState);
    const [questionID, setQuestionId] = useState<string>("");
    const [joined, setJoined] = useState(false);
    const [answersLockedIn, setanswersLockedIn] = useState(false);
    const [answersToShow, setAnswersToShow] = useState([""]);
    const [writerToShow, setWriterToShow] = useState([""]);

    const activeQuestion = useMemo(
        () => game.questions.find(q => q.id === questionID),
        [game.questions, questionID]
    );

    const submitAnswer = (answer: string) => {
      const trimmed = answer.trim();
      if (!socket) {
        console.log("socket issue");
        return;
      }
      if (!trimmed) {
        console.log("trimmed issue");
        return;
      }
      console.log("creating fake answer");

      const answerId = crypto.randomUUID();

      // const newAnswer: FakeAnswer = {
      //   id: answerId,
      //   user_id: user_id,
      //   question_id: questionID,
      //   answer_text: answer,
      // };

      //dispatch({ type: "SUBMIT_FAKE_ANSWER", payload: newAnswer });

      socket.emit("submit_fake_answer", {
        questionId: questionID,
        text: trimmed,
        numContestants: game.contestants.length - 1,
        answerId: answerId
      });
    };

    useEffect(() => {
      if (!socket){
        console.log("no socket on host side");
        return;
      }

      const onAnswerSubmitted = (p: {
        answerId: string;
        questionId: string;
        userId: string;
        text: string;
      }) => {
        console.log("[contestant] answer_submitted", p);
        const fakeAnswer: FakeAnswer = { id: p.answerId, user_id: p.userId, question_id: p.questionId, answer_text: p.text };
        if(game.questions)
        dispatch({ type: "SUBMIT_FAKE_ANSWER", payload: fakeAnswer });
      };

      socket.on("answer_submitted", onAnswerSubmitted);
      return () => {
        socket.off("answer_submitted", onAnswerSubmitted);
      };
    }, [socket]);

    useEffect(() => {
      if (!socket) return;
      const onRoundScored = (p: { guesses: GuessRecord[] }) => {
        dispatch({ type: "GUESS_ANSWER", payload: p.guesses });
        console.log("updated scores!");
      };
      socket.on("scores_update", onRoundScored);
      return () => {
        socket.off("scores_update", onRoundScored);
      };
    }, [socket]);

    useEffect(() => {
        console.log("fired");
      if (!socket) {
        return;
      }
      const onMoveToNextRound = (p: {
        gameId: string;
        currentRound: number;
      }) => {
        setanswersLockedIn(false);
        const idx = Math.max(0, p.currentRound - 1);
        const q = game.questions[idx];
        if (q) {
          setQuestionId(q.id);
          dispatch({ type: "SET_CURRENT_ROUND", payload: p.currentRound });
        }
      };
      socket.on("moved_next_round", onMoveToNextRound);
    }, [socket, game.questions]);

    useEffect(() => {
        if(!socket) {
            return;
        }
        const onAnswersLockedIn = (p: { gameId: string; questionId: string }) => {
            setanswersLockedIn(true);
        }

        socket.on("answers_locked_in", onAnswersLockedIn);
    }, [socket]);

    useEffect(() => {
        console.log("revealAnswer useEffect");
        if(!socket) {
            return;
        }
        const onRevealAnswer = (p: { gameId: string, questionId: string, answerId: string }) => {
            console.log("reveal method", p.answerId);
            setAnswersToShow(prev => [...prev, p.answerId]);
        }
        socket.on("reveal_answer", onRevealAnswer);
    },[socket]);

    useEffect(() => {
        console.log("revealWriter useEffect");
        if(!socket) {
            return;
        }
        const onRevealWriter = (p: { gameId: string, questionId: string, answerId: string }) => {
            console.log("reveal method", p.answerId);
            setWriterToShow(prev => [...prev, p.answerId]);
        }
        socket.on("reveal_writer", onRevealWriter);
    },[socket]);

    const joinGame = () => {
      if (!socket || !game_id || joined) {
        //console.log("[contestant] no socket (provider not mounted yet?)");
        console.log("Either no socket, game_id, or joined already");
        return;
      }

      const onRoundStarted = (p: { questionId: string }) => {
        console.log("[contestant] round_started", p);
        setQuestionId(p.questionId);
      };

      const onRoomState = (p: {
        gameId: string;
        state: { currentRound: number; questions: Array<{ id: string }> };
      }) => {
        console.log("[contestant] room_state", p);
        if(p.state.currentRound > 0){
            const idx = Math.max(0, (p.state.currentRound ?? 1) - 1);
            const qid = p.state.questions[idx]?.id;
            if (qid) setQuestionId(qid); 
        } else {
            setQuestionId("");
        }
        
      };

      socket.on("round_started", onRoundStarted);
      socket.on("room_state", onRoomState);

      const doJoin = () => {
        console.log("[contestant] joining room", game_id);
        socket.emit("join_game", { gameId: game_id });
        socket.emit("request_room_state", { gameId: game_id }); // server replies with room_state
      };

      if (socket.connected) doJoin();
      else socket.once("connect", doJoin);

      dispatch({ type: "ADVANCE_ROUND"});

      setJoined(true);
    };

    const fetchGame = async () => {
        try {
            const response = await fetch(`/api/games/${game_id}`);
            const data = await response.json();
            const contestants = data.users.map((u: incomingUser) => {
                return new User(u.id, u.first_name, u.last_name, u.nickname, u.role);
            })
            const questions = data.questions.map((q: Question) => {
                const answers = q.answers.map((a: Answer) => {
                    return new Answer(a.id, q.id, a.answer_text, a.submitted_by, a.correct, '', a.notes);
                })
                return new Question(q.id, data.game_id, q.question_text, "", "", answers, q.notes, 0);
            })
            dispatch({ type: 'SET_GAME', payload: new Game(data.game_id, 
                data.name, 
                new Date().toISOString(), 
                null, 
                'In Progress', 
                '', contestants, questions, 0) 
            })

        } catch (err) {
            console.error('Failed to load game: ', err);
        }
    }

    useEffect(() => {
        fetchGame();
    },[]);

    if(game.contestants.length < 1) return <p>Loading...</p>

    if(!joined) return <button onClick={joinGame}>Join Game</button>

    if(!activeQuestion) return <p>Waiting for host to start...</p>
console.log(game);
    return (
      <>
        <ScoreBanner users={game.contestants} />
        {!answersLockedIn && (
           <ContestantQuestionDisplay
                question={activeQuestion}
                roundNumber={game.currentRound ?? 1} // optional; you can also derive from room_state if you keep it
                submitAnswer={submitAnswer}
            /> 
        )}
        {answersLockedIn && (
            <ContestantAnswerDisplay 
                question={activeQuestion}
                roundNumber={game.currentRound ?? 1} //TODO: better null checking
                questionNumber={game.currentRound ?? 1}
                answerToShow={answersToShow}
                writerToShow={writerToShow}
                contestants={game.contestants}
            />
        )}
      </>
    );
};
export default ContestantGame;

