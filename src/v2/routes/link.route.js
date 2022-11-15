const express = require('express');
const shortid = require('shortid');
const _ = require('lodash');
const { LinkModel, UserModel } = require('../models');
const { log } = require('../utils');
const { decodeToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', decodeToken, async (req, res) => {
  try {
    if (_.isEmpty(req.query.link)) {
      return res.status(400).send('link required');
    }
    const link = await LinkModel.create({ rootLink: req.query.link, shortLink: shortid.generate() });
    if (!_.isEmpty(req.user)) {
      await UserModel.findOneAndUpdate({ username: req.user.username }, { $push: { links: link._id } });
    }
    return res.send(`http://localhost:3000/${link.shortLink}`);
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
});

module.exports = router;
