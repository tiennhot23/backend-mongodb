const _ = require('lodash');
const { UserModel, LinkModel } = require('../../models');
const { log } = require('../../common/utils');
const redis = require('../../database/redis');

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (_.isEmpty(username) && _.isEmpty(password)) {
        return res.status(400).send('Username and password required');
      }

      const user = await UserModel.findOne({ username, password }, { password: 0 });
      if (_.isEmpty(user)) {
        return res.status(404).send('Username and password not accepted');
      }

      req.session.user = user;

      return res.send('Signed in');
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },

  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (_.isEmpty(username) && _.isEmpty(password)) {
        return res.status(400).send('Username and password required');
      }

      await UserModel.create({ username, password });
      return res.send('Signed up');
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },

  accessURL: async (req, res) => {
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
  },

  getCookie: async (req, res) => {
    try {
      const data = await redis.get(`sess:${req.sessionID}`);
      return res.json(JSON.parse(data));
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },

  increase: (req, res) => {
    try {
      if (_.has(req.session, 'count')) {
        req.session.count += 1;
      } else req.session.count = 0;
      return res.send(req.session);
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },

  deleteCookie: (req, res) => {
    try {
      const e = req.session.destroy();
      return res.status(200).send(e);
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },
};
