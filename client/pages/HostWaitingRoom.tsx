import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const HostWaitingRoom = () => {
    const { game_id } = useParams();

    const fetchGame = async () => {
        console.log("ID: ", game_id);
        try {
            const response = await fetch(`/api/games/${game_id}`);
            const data = await response.json();
            console.log(data);
            //Add reducer logic to store the game
        } catch (err) {
            console.error('Failed to load game: ', err);
        }
    }

    useEffect(() => {
        fetchGame();
    },[])

    return (
        <>
            <div>Game Waiting Room</div>
        </>
    );
};


export default HostWaitingRoom;