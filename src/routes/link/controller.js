import _ from 'lodash';
import { HttpStatus, serverUrl } from '../../common/constants.js';
import { LinkModel } from '../../models/index.js';
import { shortID } from '../../modules/index.js';

const createShortLink = async (req, res) => {
  try {
    const {
      isPublic,
      rootLink,
    } = req.body;
    const { user } = req.session;
    if (_.isEmpty(rootLink)) {
      return res.status(HttpStatus.BAD_REQUEST).send('link required');
    }

    const link = await LinkModel.create({
      ownerId: user ? user._id : null,
      rootLink,
      shortLink: shortID.generateID(),
      isPublic: user ? isPublic : true,
    });
    return res.status(HttpStatus.CREATED).send(`${serverUrl}${link.shortLink}`);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};

const deleteShortLink = async (req, res) => {
  try {
    const { shortLink } = req.params;
    const { user } = req.session;
    const link = await LinkModel.findOne({ shortLink });
    if (!link) {
      return res.status(HttpStatus.NOT_FOUND).send('Invalid link');
    }
    if (!link.ownerId.equals(user._id)) {
      return res.status(HttpStatus.FORBIDDEN).send('Not your own link');
    }
    await LinkModel.deleteOne({ _id: link._id });
    return res.status(HttpStatus.OK).send('Deleted');
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
};
export {
  createShortLink,
  deleteShortLink,
};
