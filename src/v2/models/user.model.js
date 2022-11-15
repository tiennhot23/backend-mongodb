/* eslint-disable func-names */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link', default: [] }],
});

module.exports = mongoose.model('User', userSchema);
