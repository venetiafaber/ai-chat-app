import express from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// applies protect middleware to all routes in this router
router.use(protect);

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/:id', deleteMessage);


export default router;