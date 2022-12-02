import express from 'express';
import { login, accessURL, register, logout } from './controller.js';
import { requireUser } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);

router.post('/logout', requireUser, logout);

router.post('/register', register);

router.get('/:shortLink', accessURL);

export default router;
