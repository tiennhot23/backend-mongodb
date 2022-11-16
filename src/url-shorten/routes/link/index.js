const express = require('express');
const { decodeToken, verifyToken } = require('../../middlewares/auth');
const { getShortLink, deleteLink } = require('./controller');

const router = express.Router();

router.get('/', decodeToken, getShortLink);

router.delete('/:shortLink', verifyToken, deleteLink);

module.exports = router;
