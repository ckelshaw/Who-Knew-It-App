import express from 'express';
import {
  submitAnswer,
  getAnswersForQuestion,
  recordGuess,
} from '../controllers/answerController';

const router = express.Router();

router.post('/', submitAnswer);
router.get('/question/:questionId', getAnswersForQuestion);
router.post('/guess', recordGuess);

export default router;