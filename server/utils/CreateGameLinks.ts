import dotenv from 'dotenv';

export const createGameLinks = (game_id: string, user_id: string) => {
    return `localhost:5173/${game_id}/${user_id}`;
}