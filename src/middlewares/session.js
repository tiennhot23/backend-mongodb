import moment from 'moment-timezone';
import { HttpStatus } from '../common/constants.js';
import { UserModel } from '../models/index.js';
import { redis } from '../services/index.js';

const validateSession = async (req, res, next) => {
  const newSessionID = req.sessionID;
  const [oldSessionID, username] = retrieveSessionIDAndUsername(req.headers.cookie);
  if (newSessionID !== oldSessionID) { // session expired, refresh session
    // get previous session data
    const user = await UserModel.findOne({ username: req.params.username }, { password: 0 });
    // check if session is refreshed or not
    const isValidSessionID = await redis.hget(`user:${username}:whitelistKey`, `sess:${oldSessionID}`);
    if (isValidSessionID) {
      // move current old sessionID to blacklist
      await redis.hset(`user:${username}:blacklistKey`, `sess:${oldSessionID}`, Date.now());
      await redis.hdel(`user:${username}:whitelistKey`, `sess:${oldSessionID}`);
      // set new sessionID to whitelist
      await redis.hset(`user:${username}:whitelistKey`, `sess:${oldSessionID}`, Date.now());
      req.session.user = user;
    } else {
      // session already refresh or session deleted by logout action, detect unnormal action
      const timeRefresh = await redis.hget(`user:${username}:blacklistKey`, `sess:${oldSessionID}`);
      return res.status(HttpStatus.BAD_REQUEST).send(`Your session has been changed ${moment(timeRefresh).fromNow()}`);
    }
  }
  return next();
};

function retrieveSessionIDAndUsername(cookies) {
  let sessionID = '';
  let username = '';
  cookies.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (name.trim() === 'sid') {
      sessionID = rest[0].split('.')[0].substring(4);
    }
    if (name.trim() === 'username') {
      username = rest[0];
    }
  });
  return [sessionID, username];
}

export { validateSession };
