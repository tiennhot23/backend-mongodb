/* eslint-disable func-names */
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: String,
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
});

module.exports = mongoose.model('Chapter', chapterSchema);
