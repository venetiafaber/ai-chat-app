import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js'

// creates a router instance
const router = express.Router();

// public routes - NO authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);

// private routes - authentication REQUIRED
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/', protect, getUsers);

export default router;



