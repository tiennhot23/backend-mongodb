/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../../services/index.js';
import { HttpStatus } from '../../common/constants.js';
import { UserModel, LinkModel } from '../../models/index.js';

const refreshSessionID = async (req, res) => {
  try {
    const { username, refreshToken } = req.cookie;
    const expiredSessionID = await redis.hget(`user:${username}:tokens`, `${refreshToken}`);

    if (!expiredSessionID) {
      await redis.hdel(`user:${username}:tokens`, `${refreshToken}`);
      req.session.destroy();
      res.clearCookie('username');
      res.clearCookie('refreshToken');
      return res.status(HttpStatus.BAD_REQUEST).send('Cannot authorized. Please login again');
    }
    await redis.hdel(`user:${username}:tokens`, `${refreshToken}`);
    const user = await UserModel.findOne();
    const newRefreshToken = uuidv4();
    res.cookie('refreshToken', newRefreshToken, { path: '/r', httpOnly: true, secure: false });
    res.cookie('username', user.username);
    await redis.hset(`user:${username}:tokens`, `${newRefreshToken}`, `sess:${req.sessionID}`);
    return res.send('Refreshed');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return res.status(HttpStatus.BAD_REQUEST).send('Username and password required');
    }

    const user = await UserModel.findOne({ username, password }, { password: 0 });
    if (_.isEmpty(user)) {
      return res.status(HttpStatus.NOT_FOUND).send('Username and password not accepted');
    }
    if (!user.enabled) {
      return res.status(HttpStatus.FORBIDDEN).send('User disabled');
    }

    req.session.user = user;
    res.cookie('username', user.username);
    const refreshToken = uuidv4();
    res.cookie('refreshToken', refreshToken, { path: '/r', httpOnly: true, secure: false });
    await redis.hset(`user:${username}:tokens`, `${refreshToken}`, `sess:${req.sessionID}`);

    return res.status(HttpStatus.ACCEPTED).send('Signed in');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};

const logout = async (req, res) => {
  try {
    const { username, refreshToken } = req.cookie;
    await redis.hdel(`user:${username}:tokens`, `${refreshToken}`);
    req.session.destroy();
    res.clearCookie('username');
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.OK).send('Signed out');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (_.isEmpty(username) && _.isEmpty(password)) {
      return res.status(HttpStatus.BAD_REQUEST).send('Username and password required');
    }

    if (await UserModel.findOne({ username })) {
      return res.status(HttpStatus.BAD_REQUEST).send('Username is already used');
    }

    await UserModel.create({ username, password });
    return res.status(HttpStatus.CREATED).send('Signed up');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};

const accessURL = async (req, res) => {
  try {
    const { user } = req.session;
    const link = await LinkModel.findOne({
      shortLink: req.params.shortLink,
    });
    if (!link) {
      return res.status(HttpStatus.NOT_FOUND).send('Link is not available');
    }
    if (!link.isPublic && (!user || !link.ownerId.equals(user._id))) {
      return res.status(HttpStatus.FORBIDDEN).send('Cannot access this link');
    }
    await LinkModel.updateOne(
      { shortLink: req.params.shortLink },
      { $inc: { numberOfClick: 1 } },
    );
    return res.redirect(link.rootLink);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};
export {
  login,
  logout,
  register,
  accessURL,
  refreshSessionID,
};
