const express = require('express');
const { UserModel } = require('../models');
const { log } = require('../utils');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.user.username }, { password: 0 })
      .populate('links');
    return res.json(user);
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
});

module.exports = router;
