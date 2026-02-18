import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';

// creates a router instance
const router = express.Router();

// public routes - NO authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);

// private routes - authentication REQUIRED
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getAllUsers);

export default router;



