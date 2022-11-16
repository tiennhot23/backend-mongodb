/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const _ = require('lodash');
const Database = require('./datatbase');
const { BookModel, AuthorModel } = require('./models');
const { populate, initDB, populateOpt,
  populateOptWithLean, aggregateLookup, aggregateLookupOpt } = require('./modules');

async function normal() {
  console.time('1. normal');
  const res = await populate(BookModel, {}, { path: 'authors' });
  console.timeEnd('1. normal');
  return res;
}
async function mongoosePopulate() {
  console.time('2. populate');
  const res = await BookModel.find({}).populate('authors');
  console.timeEnd('2. populate');
  return res;
}
async function mongoosePopulateLean() {
  console.time('3. populate with lean');
  const res = await BookModel.find({}).lean().populate('authors');
  console.timeEnd('3. populate with lean');
  return res;
}
async function populateOptimized() {
  console.time('4. populate optimized');
  const res = await populateOpt(BookModel, {}, { path: 'authors' });
  console.timeEnd('4. populate optimized');
  return res;
}
async function populateOptimizedLean() {
  console.time('5. populate optimized with lean option');
  const res = await populateOptWithLean(BookModel, {}, { path: 'authors' });
  console.timeEnd('5. populate optimized with lean option');
  return res;
}

async function mongooseAggregateLookup() {
  console.time('6. aggregation with lookup');
  const res = await aggregateLookup(BookModel, {}, { path: 'authors' });
  console.timeEnd('6. aggregation with lookup');
  return res;
}

async function mongooseAggregateLookupOptimized() {
  console.time('6. aggregation with lookup optimized');
  const res = await aggregateLookupOpt(BookModel, {}, { path: 'authors' });
  console.timeEnd('6. aggregation with lookup optimized');
  return res;
}

async function main() {
  try {
    await Database.connect();
    console.log('Database connection successful');
    // await normal(); // 2.515s
    // await mongoosePopulate(); // 605.346ms
    // await mongoosePopulateLean(); // 447.18ms
    // await populateOptimized(); // 674.124ms
    // await populateOptimizedLean(); // 506.017ms
    // await mongooseAggregateLookup(); // 5.779s
    // await mongooseAggregateLookupOptimized(); // 560.669ms
  } catch (e) {
    console.log(e);
  }
}

main();

function log(val) {
  console.log(JSON.stringify(val, null, 3));
}
