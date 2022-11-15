const UserModel = require('../models/user.model');

const userModule = {
  findById(id) {
    return new Promise((resolve, reject) => {
      UserModel.findById(id, (err, user) => {
        if (err) return reject(err);
        return resolve(user);
      });
    });
  },
  findStudent() {
    return new Promise((resolve, reject) => {
      UserModel.find()
        .populate({
          path: 'email',
          select: 'email',
          match: {
            email: { $regex: /@student[.\w]+$/ },
          },
        })
        .exec((err, docs) => {
          if (err) return reject(err);
          return resolve(docs);
        });
    });
  },
};

module.exports = userModule;
