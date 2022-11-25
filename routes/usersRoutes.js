import express from 'express';
import { deleteUser, getUserData, getUsers, loginUser, registerUser, updateUser, usersCount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router()

router.route('/').get(protect, getUsers).post(registerUser)
router.route('/:id').get(protect, getUserData).put(protect, updateUser).delete(protect, deleteUser)
router.post('/login', loginUser)
router.get('/get/count', usersCount)

export default router