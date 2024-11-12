import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../services/UserServices';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;