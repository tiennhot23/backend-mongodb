/* eslint-disable no-unused-vars */
import logger from 'npmlog';
import _ from 'lodash';

import { redis } from '../../services/index.js';
import { HttpStatus } from '../../common/constants.js';
import { UserModel, LinkModel } from '../../models/index.js';

const { CACHE_TTL } = process.env;

async function getUser(req, res) {
  try {
    let user = JSON.parse(await redis.get(`user:${req.params.username}`));
    if (!user) { user = await UserModel.findOne({ username: req.params.username }, { password: 0 }); }
    if (user) {
      await redis.set(`user:${user.username}`, JSON.stringify(user), 'EX', CACHE_TTL);
      user.links = await LinkModel.find({ ownerId: user._id });
      return res.json(user);
    }
    return res.status(HttpStatus.NOT_FOUND).send('User not found');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function getAllLinks(req, res) {
  try {
    const links = await LinkModel.find();
    return res.json(links);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function disableUser(req, res) {
  try {
    const { username } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { username },
      { enabled: false },
      { new: true, projection: { password: 0 } },
    );
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send('User not found');
    }
    await redis.set(`user:${user.username}`, JSON.stringify(user), 'EX', CACHE_TTL);
    const whitelistKey = await redis.hkeys(`user:${user.username}:whitelistKey`);
    if (whitelistKey.length > 0) {
      const hSetObject = whitelistKey.reduce((pre, cur) => ({ ...pre, [cur]: Date.now() }), {});

      // delete all session
      await redis.del(whitelistKey);
      // add current session to blacklist
      await redis.hset(`user:${user.username}:blacklistKey`, hSetObject);
      // delete all current session
      await redis.del(`user:${user.username}:whitelistKey`);
    }
    return res.status(HttpStatus.OK).send('Disabled');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export {
  getUser,
  getAllLinks,
  disableUser,
};
