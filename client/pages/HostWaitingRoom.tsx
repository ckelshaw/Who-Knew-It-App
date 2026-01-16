import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { gamePlayReducer, initialGameState } from '../reducers/gamePlayReducer';
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
import { Game } from '../../shared/classes/Game';
import { User } from '../../shared/classes/User';
import ScoreBanner from '../components/ScoreBanner';
import HostQuestionDisplay from "../components/HostQuestionDisplay";
import type { GuessRecord, FakeAnswer } from '../src/types/GuessRecord'
import GameSummaryModal from '../components/GameSummaryModal';
import { useSocket } from '../src/socket/socket-context';
import ContestantPaths from '../components/ContestantPaths';

type incomingUser = {
    id: string,
    first_name: string,
    last_name: string,
    nickname: string,
    role: string
};


const HostWaitingRoom = () => {
    const { game_id } = useParams();

    const socket = useSocket();

    const [game, dispatch] = useReducer(gamePlayReducer, initialGameState);
    const [open, setOpen] = useState(false);
    const [allAnswersIn, setAllAnswersIn] = useState(false);

    const fetchGame = async () => {
        try {
            const response = await fetch(`/api/games/${game_id}`);
            const data = await response.json();
            console.log(data);
            const contestants = data.users.map((u: incomingUser) => {
                return new User(u.id, u.first_name, u.last_name, u.nickname, u.role);
            })
            const questions = data.questions.map((q: Question) => {
                const answers = q.answers.map((a: Answer) => {
                    return new Answer(a.id, q.id, a.answer_text, a.submitted_by, a.correct, '', a.notes);
                })
                return new Question(q.id, data.game_id, q.question_text, "", "", answers, q.notes, 0);
            })

            if(socket && game_id){
                socket.emit("register_game", {
                    gameId: game_id,
                    currentRound: 0,
                    questions: questions.map(q => ({ id: q.id })),
                });
            }
            if(socket && game_id){
                socket?.emit("debug_sync", { gameId: game_id });
            }

            dispatch({ 
                type: 'SET_GAME', 
                payload: new Game(
                    data.game_id, 
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

    const submitSelections = (selections: GuessRecord[]) => {
        if (socket && game_id) {
            socket.emit("score_round", { gameId: game_id, guesses: selections });
        }
    };

    useEffect(() => {
      if (!socket) return;
      const onRoundScored = (p: { guesses: GuessRecord[] }) => {
        dispatch({ type: "GUESS_ANSWER", payload: p.guesses });
      };
      socket.on("scores_update", onRoundScored);
      return () => {
        socket.off("scores_update", onRoundScored);
      }
    }, [socket]);

    const advanceRound = () => {
        dispatch({ type: "ADVANCE_ROUND" });
        console.log("Current round: ", game.currentRound);
        socket?.emit("next_round", { gameId: game_id ?? "", currentRound: game.currentRound ?? 0 })
    }

    const finishGame = () => {
        dispatch({ type: "CALCULATE_WINNER" });
        dispatch({ type: "END_GAME" });
        setOpen(true);
    }

    const lockInAnswers = () => {
        const currQuestion = (game.currentRound ?? 0) - 1;
        console.log(`gameID ${game_id}, currQuestion: ${currQuestion}`);
        socket?.emit("lock_in_answers", { gameId: game_id ?? "", questionId: game.questions[currQuestion].id });
    }

    const showContestantsAnswer = (answerId: string) => {
        console.log("show contestant answer", answerId);
        const currQuestion = (game.currentRound ?? 0) - 1;
        socket?.emit("show_answer_to_contestant", {
          gameId: game_id ?? "",
          questionId: game.questions[currQuestion].id,
          answerId: answerId,
        });
    }

    const showWriter = (answerId: string) => {
        console.log("show contestant writer", answerId);
        const currQuestion = (game.currentRound ?? 0) - 1;
        socket?.emit("show_writer_to_contestant", {
          gameId: game_id ?? "",
          questionId: game.questions[currQuestion].id,
          answerId: answerId,
        });
    }

    const gameStart = () => {
      if (!socket || !game_id) return;

      // Compute the first round and question *without* relying on async state updates
      const nextRound = 1; // starting round
      const firstQuestion = game.questions[0]; // already loaded from fetchGame
      if (!firstQuestion) return;

      // 1) Tell server to start the round for everyone in the room
      socket.emit("start_round", {
        gameId: game_id,
        questionId: firstQuestion.id,
        round: nextRound,
      });

      // 2) Update local reducer for host UI
      dispatch({ type: "ADVANCE_ROUND" });
    };


    useEffect(() => {
        if (!socket){
            console.log("no socket on host side");
            return;
        }
        const onConnected = (p: any) => {
            console.log("[host] connected", p);          // should log { userId, role: 'host', gameId }
            if (game_id) socket.emit("join_game", { gameId: game_id });
        };

        socket.on("connected", onConnected);

        return () => {
            socket.off("connected", onConnected);
        };
    }, [socket, game_id]);

    useEffect(() => {
        const onAllAnwersIn = (p: any) => {
            console.log("[host] all answers for question are in", p);
            setAllAnswersIn(true);
        };

        socket?.on("all_answers_in", onAllAnwersIn);
    },[socket]);

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
        console.log("[host] answer_submitted", p);
        const fakeAnswer: FakeAnswer = { id: p.answerId, user_id: p.userId, question_id: p.questionId, answer_text: p.text };
        dispatch({ type: "SUBMIT_FAKE_ANSWER", payload: fakeAnswer });
      };

      socket.on("answer_submitted", onAnswerSubmitted);
      return () => {
        socket.off("answer_submitted", onAnswerSubmitted);
      };
    }, [socket]);
    

    useEffect(() => {
        fetchGame();
    },[]);

    if(game.contestants.length === 0) return <p>Loading...</p>

    if(game.currentRound === 0) return <button onClick={gameStart}>Start Game</button>

    return (
        <>
            <ScoreBanner users={game.contestants}></ScoreBanner>
            <ContestantPaths
                contestants={game.contestants}
                gameId={game.game_id}
            />
            {game.questions.map((q, index) => (
                <HostQuestionDisplay 
                    allQuestionsIn={allAnswersIn}
                    key={index} 
                    question={q}
                    roundNumber={game.currentRound} 
                    contestants={game.contestants} 
                    questionNumber={index + 1} 
                    submitSelections={submitSelections} 
                    advanceRound={advanceRound}
                    lockInAnswers={lockInAnswers}
                    showContestantsAnswer={showContestantsAnswer}
                    showWriter={showWriter}
                />
            ))}
            {game.currentRound === game.questions.length + 1 && (
                <button onClick={finishGame}>Finish Game</button>
            )}
            <GameSummaryModal game={game} isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
};


export default HostWaitingRoom;