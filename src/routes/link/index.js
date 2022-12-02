import express from 'express';
import { createShortLink, deleteShortLink } from './controller.js';

const router = express.Router();

router.post('/', createShortLink);

router.delete('/:shortLink', deleteShortLink);

export default router;
