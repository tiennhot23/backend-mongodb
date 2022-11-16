const _ = require('lodash');
const { HttpStatus } = require('../../common/constants');
const { LinkModel, UserModel } = require('../../models');
const { log } = require('../../common/utils');
const { serverUrl } = require('../../configs/dev.json');
const { shortID } = require('../../modules');

module.exports = {
  getShortLink: async (req, res) => {
    try {
      if (_.isEmpty(req.query.link)) {
        return res.status(400).send('link required');
      }
      const link = await LinkModel.create({ rootLink: req.query.link, shortLink: shortID.generateID() });
      if (!_.isEmpty(req.user)) {
        await UserModel.findOneAndUpdate({ username: req.user.username }, { $push: { links: link._id } });
      }
      return res.status(201).send(`${serverUrl}${link.shortLink}`);
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },

  deleteLink: async (req, res) => {
    try {
      const { shortLink } = req.params;
      const { username } = req.user;
      const user = await UserModel.findOne({ username })
        .populate({
          path: 'links',
          match: { shortLink },
        });
      if (user.links.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).send('You never created any link like this');
      }
      await LinkModel.deleteOne({ shortLink });
      return res.status(200).send('Delete successfull');
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },
};
