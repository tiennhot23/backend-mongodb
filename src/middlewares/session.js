import _ from 'lodash';
import { HttpStatus } from '../common/constants.js';

const requireRefreshToken = async (req, res, next) => {
  if (!req.cookie.refreshToken) {
    return res.status(HttpStatus.UNAUTHORIZED).send('Cannot authorized. Please login again');
  }
  return next();
};

const parseCookie = async (req, __, next) => {
  req.cookie = {};
  _.split(req.headers.cookie, ';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (name.trim() === 'sid') {
      req.cookie.sid = rest[0].split('.')[0].substring(4);
    } else {
      req.cookie[name.trim()] = rest[0];
    }
  });
  next();
};

export { requireRefreshToken, parseCookie };
