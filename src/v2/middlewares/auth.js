const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { SECRETKEY } = require('../configs');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    res.status(401).send('Unauthorized');
  } else {
    jwt.verify(token, SECRETKEY, async (err, data) => {
      if (err) res.status(401).send('Token invalid');
      else {
        req.user = data;
        next();
      }
    });
  }
};

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!_.isEmpty(token)) {
    jwt.verify(token, SECRETKEY, async (err, data) => {
      if (err) res.status(401).send('Token invalid');
      else {
        req.user = data;
      }
    });
  }
  next();
};

module.exports = { verifyToken, decodeToken };
