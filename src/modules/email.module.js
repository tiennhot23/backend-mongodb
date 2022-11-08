const { EmailModel } = require('../models');

const emailModule = {
  saveMulti(emails) {
    return new Promise((resolve, reject) => {
      const arrSchema = emails.map(e => ({
        email: e,
      }));
      EmailModel.insertMany(arrSchema, (err, docs) => {
        if (err) return reject(err);
        return resolve(docs.map(e => e._id));
      });
    });
  },
};

module.exports = emailModule;
