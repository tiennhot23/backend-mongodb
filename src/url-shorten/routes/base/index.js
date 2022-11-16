const express = require('express');
const { login, register, accessURL } = require('./controller');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/:shortLink', accessURL);

module.exports = router;
