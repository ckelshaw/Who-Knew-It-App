import express from 'express';
import {
  addQuestion,
  getQuestionsForGame,
} from '../controllers/questionController';

const router = express.Router();

router.post('/', addQuestion);
router.get('/game/:gameId', getQuestionsForGame);

export default router;