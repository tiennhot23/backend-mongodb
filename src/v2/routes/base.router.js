const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { UserModel, LinkModel } = require('../models');
const { log } = require('../utils');
const { SECRETKEY } = require('../configs');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (_.isEmpty(username) && _.isEmpty(password)) {
      res.status(400).send('Username and password required');
    }

    const user = await UserModel.findOne({ username, password });
    if (_.isEmpty(user)) {
      res.status(404).send('Username and password accepted');
    }

    const accessToken = jwt.sign({ username: user.username }, SECRETKEY, { expiresIn: '7d' });
    res.json({ accessToken });
  } catch (e) {
    log(e);
    res.status(500).send(e.message);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return res.status(400).send('Username and password required');
    }

    const user = await UserModel.create({ username, password });
    const accessToken = jwt.sign({ username: user.username }, SECRETKEY, { expiresIn: '7d' });
    return res.json({ accessToken });
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
});

router.get('/:shortLink', async (req, res) => {
  try {
    const link = await LinkModel.findOneAndUpdate(
      { shortLink: req.params.shortLink },
      { $inc: { numberOfClick: 1 } },
    );
    return res.redirect(link.rootLink);
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
});

module.exports = router;
