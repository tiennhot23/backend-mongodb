/* eslint-disable func-names */
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

module.exports = mongoose.model('Author', authorSchema);
