/* eslint-disable func-names */
const mongoose = require('mongoose');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Email',
  }],
  /** NOTE
  book: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
  this is `bad schema design`, the amount of book this user write maybe very large
  => leed to performance issues
  one-to-many relationships, should be stored on the "many" side.
  But, normal populate dont support populating an user's books
  So that, u need to use `virtual populate`
   */
});

// virtual populate
userSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author',
});

userSchema.virtual('fullname')
  .get(() => `${this.firstName} ${this.lastName}`)
  .set(function (fullname) { // this must use function keyword to access `this` userschema
    const strs = fullname.split(' ');
    this.lastName = strs.pop();
    this.firstName = _.join(strs, ' ');
  });

userSchema.methods.toNameUppercase = function () {
  return `${this.firstName} ${this.lastName}`.toUpperCase();
};

userSchema.statics.getUsers = function () {
  return new Promise((resolve, reject) => {
    this.find().populate('email')
      .exec((err, docs) => {
        if (err) return reject(err);
        return resolve(docs);
      });
  });
};

module.exports = mongoose.model('User', userSchema);
