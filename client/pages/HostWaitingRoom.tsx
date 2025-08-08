import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { gamePlayReducer, initialGameState } from '../reducers/gamePlayReducer';
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
import { Game } from '../../shared/classes/Game';
import { User } from '../../shared/classes/User';
import ScoreBanner from '../components/ScoreBanner';
import HostQuestionDisplay from "../components/HostQuestionDisplay";
import type { GuessRecord } from '../src/types/GuessRecord'

type incomingUser = {
    id: string,
    first_name: string,
    last_name: string,
    nickname: string,
    role: string
};

const HostWaitingRoom = () => {
    const { game_id } = useParams();
    const [game, dispatch] = useReducer(gamePlayReducer, initialGameState)

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

    const submitSelections = (selections: GuessRecord[]) => {
        console.log("Selections:", selections);
        dispatch({ type: "GUESS_ANSWER", payload: selections });
        console.log(game);
    }

    useEffect(() => {
        fetchGame();
    },[])


    if(game.contestants.length === 0) return <p>Loading...</p>

    return (
        <>
            <ScoreBanner users={game.contestants}></ScoreBanner>
            {game.questions.map((q, index) => (
                <HostQuestionDisplay 
                    key={index} 
                    question={q} 
                    contestants={game.contestants} 
                    questionNumber={index + 1} 
                    submitSelections={submitSelections} 
                />
            ))}
            
        </>
    );
};


export default HostWaitingRoom;