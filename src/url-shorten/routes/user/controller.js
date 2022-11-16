const { UserModel } = require('../../models');
const { log } = require('../../common/utils');

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ username: req.user.username }, { password: 0 })
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
      return res.json(user);
    } catch (e) {
      log(e);
      return res.status(500).send(e.message);
    }
  },
};
