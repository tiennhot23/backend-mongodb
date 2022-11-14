/* eslint-disable func-names */
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
});

module.exports = mongoose.model('Book', bookSchema);
