/* eslint-disable no-unused-vars */
import _ from 'lodash';
import { redis } from '../../services/index.js';
import { HttpStatus } from '../../common/constants.js';
import { UserModel, LinkModel } from '../../models/index.js';

const { CACHE_TTL } = process.env;

async function getLinks(req, res) {
  try {
    const { user } = req.session;
    const links = await LinkModel.find({ ownerId: user._id });
    // if (await redis.zCard(`links:${req.user.username}`) === 0) {
    //   const user = await UserModel.findOne({ username: req.user.username }, { password: 0 })
    //     .populate({
    //       path: 'links',
    //     });
    //   const links = _.map(user.links, val => ({
    //     score: val.numberOfClick,
    //     value: JSON.stringify({ rootLink: val.rootLink, shortLink: val.shortLink }),
    //   }));
    //   await redis.ZADD(`links:${req.user.username}`, links);
    // }
    // let links = await redis.ZRANGE_WITHSCORES(
    //   `links:${req.user.username}`,
    //   0,
    //   -1,
    //   { REV: true },
    // );
    // links = _.map(links, val => ({ numberOfClick: val.score, ...JSON.parse(val.value) }));
    return res.json(links);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function disableAccount(req, res) {
  try {
    const { username } = req.session.user;
    const user = await UserModel.findOneAndUpdate(
      { username },
      { enabled: false },
      { new: true, projection: { password: 0 } },
    );
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send('User not found');
    }
    await redis.set(`user:${user.username}`, JSON.stringify(user), 'EX', CACHE_TTL);

    // get all key sess:... of user
    const activeSessionID = await redis.hvals(`user:${username}:tokens`);
    // delete all  current session
    await redis.del([...activeSessionID, `user:${username}:tokens`]);
    return res.status(HttpStatus.OK).send('Disabled');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function logoutAll(req, res) {
  try {
    const { username } = req.session.user;
    // get all key sess:... of user
    const activeSessionID = await redis.hvals(`user:${username}:tokens`);
    // delete all  current session
    await redis.del([...activeSessionID, `user:${username}:tokens`]);
    return res.status(HttpStatus.OK).send('Disabled');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export { getLinks, disableAccount, logoutAll };
