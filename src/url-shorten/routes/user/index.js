const express = require('express');
const { verifyToken } = require('../../middlewares/auth');
const { getUser, getLinks } = require('./controller');

const router = express.Router();

router.get('/', verifyToken, getUser);
router.get('/created-links', verifyToken, getLinks);

module.exports = router;
