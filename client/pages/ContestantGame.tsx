import { useReducer, useEffect } from "react";
import ContestantQuestionDisplay from "../components/ContestantQuestionDisplay";
import ScoreBanner from "../components/ScoreBanner";
import { User } from "../../shared/classes/User";
import { Answer } from '../../shared/classes/Answer';
import { Question } from '../../shared/classes/Question';
import { Game } from '../../shared/classes/Game';
import { useParams } from 'react-router-dom';
import { gamePlayReducer, initialGameState } from '../reducers/gamePlayReducer';
import type { FakeAnswer } from "../src/types/GuessRecord";

type incomingUser = {
    id: string,
    first_name: string,
    last_name: string,
    nickname: string,
    role: string
};

const ContestantGame = () => {
    const { game_id, user_id } = useParams();
    const [game, dispatch] = useReducer(gamePlayReducer, initialGameState);

    const submitAnswer = (answer: string) => {
        const newAnswer: FakeAnswer = { user_id: user_id, question_id: game.questions[0].id, answer_text: answer}
        dispatch({ type: "SUBMIT_FAKE_ANSWER", payload: newAnswer });
    }

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
                '', contestants, questions, 1) 
            })
        } catch (err) {
            console.error('Failed to load game: ', err);
        }
    }

    useEffect(() => {
        fetchGame();
    },[])
console.log(game);
    if(game.contestants.length < 1) return <p>Loading...</p>

    return(
        <>
            <ScoreBanner users={game.contestants} />
            <ContestantQuestionDisplay question={game.questions[0]} roundNumber={1} questionNumber={1} submitAnswer={submitAnswer}/>
        </>
    );
};
export default ContestantGame;

