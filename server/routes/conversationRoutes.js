import express from 'express';
import { getConversations, createConversation, getConversation, updateConversation, deleteConversation } from '../controllers/conversationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// applies protect middleware to all routes in this router
router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;