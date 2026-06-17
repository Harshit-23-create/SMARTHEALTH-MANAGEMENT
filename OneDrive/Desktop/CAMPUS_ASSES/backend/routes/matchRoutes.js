import express from 'express';
import { getMatches, updateMatchStatus } from '../controllers/matchController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMatches);

router.route('/:id')
  .put(protect, updateMatchStatus);

export default router;
