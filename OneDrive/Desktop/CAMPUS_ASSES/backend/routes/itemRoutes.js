import express from 'express';
import { getItems, createItem, getItemById } from '../controllers/itemController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItemById);

export default router;
