const express = require('express');
const { login, register, accessURL, getCookie, increase, deleteCookie } = require('./controller');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/:shortLink', accessURL);

// router.get('/inc', increase);

// router.get('/del', deleteCookie);

// router.get('/', getCookie);

module.exports = router;
