const _ = require('lodash');
const { UserModel } = require('../../models');
const { log } = require('../../common/utils');
// const { redis } = require('../../services');
const redis = require('../../database/redis');

async function getUser(req, res) {
  try {
    let user = await redis.GET(`user:${req.user.username}`);
    if (!user) {
      user = await UserModel.findOne({ username: req.user.username }, { password: 0 })
        .populate({
          path: 'links',
          // transform: (doc, id) => {
          //   doc.createdAt = moment(id.getTimestamp()).tz('Asia/Ho_Chi_Minh').format();
          //   return doc;
          // },
          options: {
            sort: {
              numberOfClick: -1,
            },
          },
        });
      await redis.SETEX(`user:${req.user.username}`, user);
    }
    return res.json(user);
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
}

async function getLinks(req, res) {
  try {
    if (await redis.ZCARD(`links:${req.user.username}`) === 0) {
      const user = await UserModel.findOne({ username: req.user.username }, { password: 0 })
        .populate({
          path: 'links',
        });
      const links = _.map(user.links, val => ({
        score: val.numberOfClick,
        value: JSON.stringify({ rootLink: val.rootLink, shortLink: val.shortLink }),
      }));
      await redis.ZADD(`links:${req.user.username}`, links);
    }
    let links = await redis.ZRANGE_WITHSCORES(
      `links:${req.user.username}`,
      0,
      -1,
      { REV: true },
    );
    links = _.map(links, val => ({ numberOfClick: val.score, ...JSON.parse(val.value) }));
    return res.json(links);
  } catch (e) {
    log(e);
    return res.status(500).send(e.message);
  }
}

module.exports = {
  getUser,
  getLinks,
};
