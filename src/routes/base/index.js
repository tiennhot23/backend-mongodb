import express from 'express';
import { login, accessURL, register, logout, refreshSessionID } from './controller.js';
import { requireUser } from '../../middlewares/auth.js';
import { requireRefreshToken } from '../../middlewares/session.js';

const router = express.Router();

router.post('/login', login);

router.post('/r/logout', requireUser, requireRefreshToken, logout);

router.post('/r/refresh', requireRefreshToken, refreshSessionID);

router.post('/register', register);

router.get('/:shortLink', accessURL);

export default router;
