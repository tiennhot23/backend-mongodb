/* eslint-disable import/no-extraneous-dependencies */
const { default: mongoose } = require('mongoose');
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const { AuthorModel, BookModel } = require('../models');

const populate = async (model, filter, { path, select }) => {
  const data = await model.find(filter);
  const { ref } = model.schema.path(path).options.type[0];
  const result = await Promise.all(data.map(async e => {
    const a = _.cloneDeep(e);
    a[path] = await mongoose.model(ref).find({ _id: { $in: e[path] } }, select);
    return a;
  }));
  return result;
};

const populateOpt = async (model, filter, { path, select }) => {
  const data = await model.find(filter);
  const { ref } = model.schema.path(path).options.type[0];
  const foreignIds = _.uniq(_.flattenDeep(data.map(e => e[path])));
  const foreignData = await mongoose.model(ref).find({ _id: { $in: foreignIds } }, select);
  const objects = {};
  foreignData.forEach(e => {
    objects[e._id] = e;
  });
  data.forEach(e => {
    e[path] = e[path].map(ee => objects[ee]);
  });
  return data;
};

const initDB = async () => {
  await BookModel.deleteMany();
  await AuthorModel.deleteMany();
  await Promise.all(_.fill(Array(100), 0).map(async () => {
    const authors = [];
    _.fill(Array(_.random(2, 5)), 0).forEach(() => {
      authors.push({ firstName: faker.name.firstName(), lastName: faker.name.lastName() });
    });
    const results = await AuthorModel.insertMany(authors);

    BookModel.create({ title: faker.lorem.words(), authors: results.map(e => e._id) });
  }));
};

module.exports = { populate, initDB, populateOpt };
