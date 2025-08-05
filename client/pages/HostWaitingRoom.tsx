import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { gamePlayReducer, initialGameState } from '../reducers/gamePlayReducer';
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
import { Game } from '../../shared/classes/Game';
import { User } from '../../shared/classes/User';

const HostWaitingRoom = () => {
    const { game_id } = useParams();
    const [game, dispatch] = useReducer(gamePlayReducer, initialGameState)

    const fetchGame = async () => {
        console.log("ID: ", game_id);
        try {
            const response = await fetch(`/api/games/${game_id}`);
            const data = await response.json();
            console.log(data);
            const contestants = data.contestants.map((u) => {
                return new User(u.id, u.first_name, u.last_name, u.nickname);
            })
            const questions = data.questions.map((q: Question) => {
                const answers = q.answers.map((a: Answer) => {
                    return new Answer(a.id, q.id, a.answer_text, a.submitted_by, a.correct, '', a.notes);
                })
                return new Question(q.id, data.game_id, q.question_text, "", "", answers, q.notes, 0);
            })
            console.log("Questions: ", questions);
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
    },[])

    console.log(game);

    return (
        <>
            <div>Game Waiting Room</div>
        </>
    );
};


export default HostWaitingRoom;