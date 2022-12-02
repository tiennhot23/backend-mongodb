import express from 'express';
import { disableAccount, getLinks, logoutAll } from './controller.js';
import { requireUser } from '../../middlewares/auth.js';

const router = express.Router();

router.all('*', requireUser);

router.get('/links', getLinks);

router.post('/disable', disableAccount);

router.post('/logout-all', logoutAll);

export default router;
