import { HttpStatus } from '../common/constants.js';
import { UserModel } from '../models/index.js';

const requireUser = async (req, res, next) => {
  const { user } = req.session;
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send('You have to login to continue');
  }
  return next();
};

const validateUser = async (req, res, next) => {
  let { user } = req.session;
  if (user) {
    user = await UserModel.findOne({ username: user.username });
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send('User not found');
    }
    if (!user.enabled) {
      return res.status(HttpStatus.FORBIDDEN).send('User disabled');
    }
  }
  return next();
};

export { requireUser, validateUser };
