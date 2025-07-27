import express from 'express';
import {
  createGame,
  getGameById,
  listGames,
  updateGameStatus,
} from '../controllers/gameController';

const router = express.Router();

router.post('/', createGame);
router.get('/:id', getGameById);
router.get('/', listGames);
router.put('/:id/status', updateGameStatus);

export default router;