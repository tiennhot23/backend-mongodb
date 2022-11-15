const { default: mongoose } = require('mongoose');
const _ = require('lodash');
const emailModule = require('./email.module');
const userModule = require('./user.module');

const populate = async (model, filter, { path, select, match }) => {
  const data = await model.find(filter);
  const { ref } = model.schema.path(path).options.type[0];
  const result = await Promise.all(data.map(async e => {
    const a = _.cloneDeep(e);
    a[path] = await mongoose.model(ref).find({ _id: { $in: e[path] } }, select);
    return a;
  }));
  return result;
};

module.exports = { emailModule, userModule, populate };
