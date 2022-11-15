/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const _ = require('lodash');
const Database = require('./datatbase');
const { BookModel, AuthorModel } = require('./models');
const { populate, initDB, populateOpt } = require('./modules');

(async function a() {
  try {
    // console.time('1');
    // await populate(BookModel, {}, { path: 'authors' });
    // console.timeEnd('1');
    console.time('2');
    await BookModel.find({}).populate('authors');
    console.timeEnd('2');
    // console.time('3');
    // await populateOpt(BookModel, {}, { path: 'authors' });
    // console.timeEnd('3');
  } catch (e) {
    console.log(e);
  }
}());

function log(val) {
  console.log(JSON.stringify(val, null, 3));
}
