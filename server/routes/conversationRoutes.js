import express from 'express';
import { getConversations, createConversation, getConversation, updateConversation, deleteConversation } from '../controllers/conversationController.js';

const router = express.Router();

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;