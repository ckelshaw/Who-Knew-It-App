import express from 'express';
import {
  createUser,
  listUsers,
  getUserStats,
} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', listUsers);
router.get('/:id/stats', getUserStats);

export default router;