const mongoose = require('mongoose');
const validator = require('validator').default;

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => validator.isEmail(value),
  },
});

module.exports = mongoose.model('Email', emailSchema);
