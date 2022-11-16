const express = require('express');
const { verifyToken } = require('../../middlewares/auth');
const { getUser } = require('./controller');

const router = express.Router();

router.get('/', verifyToken, getUser);

module.exports = router;
