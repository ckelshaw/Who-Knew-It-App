import express from 'express';
import userRoutes from './userRoutes';
import gameRoutes from './gameRoutes';
import questionRoutes from './questionRoutes';
import answerRoutes from './answerRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/questions', questionRoutes);
router.use('/answers', answerRoutes);

export default router;