import express from 'express';
import { getUser, getAllLinks, disableUser } from './controller.js';

const router = express.Router();

router.get('/links', getAllLinks);
router.post('/disable/:username', disableUser);
router.get('/:username', getUser);

export default router;
