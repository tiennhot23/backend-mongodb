/* eslint-disable func-names */
const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  rootLink: String,
  shortLink: { type: String, unique: true },
  numberOfClick: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

module.exports = mongoose.model('Link', linkSchema);
