/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { faker } = require('@faker-js/faker');
const { default: mongoose } = require('mongoose');
const Database = require('./datatbase');
const { UserModel, BookModel, ChapterModel, CommentModel, EmailModel } = require('./models');
const { userModule, emailModule, populate } = require('./modules');

Database.connect();

async function createEmail() {
  try {
    console.log(await new EmailModel({
      email: 'TIENNHOT23@gmail.com',
    }).save());
  } catch (e) {
    console.log(e);
  }
}

/*
  output:
  {
    email: 'tiennhot23@gmail.com', // lowercase is set true in emal schema
    _id: new ObjectId("6368b1f2e6345c27c7e5d243"), // auto-generated primary key create by Mongoose
    __v: 0  // versionKey property - contains the internal update version of document
  }
*/

async function fetchEmail() {
  try {
    console.log(await EmailModel.find({ email: 'tiennhot23@gmail.com' }));
  } catch (e) {
    console.log(e);
  }
}

async function updateEmail() {
  try {
    console.log(await EmailModel.findOneAndUpdate(
      { email: 'tiennhot23@gmail.com' },
      { email: 'tiennhot23@study.com' },
      {
        new: true, // Mongoose doesnt return updated doc, so we need to pass `new` param to take it
        runValidators: true, // validate before update
      },
    ));
  } catch (e) {
    console.log(e);
  }
}

async function deleteEmail() {
  try {
    console.log(await EmailModel.findOneAndDelete({ email: 'tiennhot23@gmail.com' }));
  } catch (e) {
    console.log(e);
  }
}

// NOTE - list all users using static method of schema
async function listAllUser() {
  try {
    console.log(await UserModel.getUsers());
  } catch (e) {
    console.log(e);
  }
}

async function listAllStudent() {
  try {
    console.log(await userModule.findStudent());
  } catch (e) {
    console.log(e);
  }
}

async function saveUserWithEmail() {
  try {
    const email = new EmailModel({ email: 'tiennhot23@gmail.com' });
    await email.save();
    const user = new UserModel();
    user.fullname = 'Nguyễn Văn Tiến';
    user.email = email._id;
    console.log({
      user: await user.save(),
      uppercase: user.toNameUppercase(), // instance method
    });
  } catch (e) {
    console.log(e);
  }
}

async function addMoreUserEmail() {
  try {
    const emails = ['tiennhot12@gmail.com', 'n18@student.ptit.edu'];
    const user = await userModule.findById('6369d29a471f9e0717887547');
    const emailsId = await emailModule.saveMulti(emails);
    user.email.push(...emailsId);
    console.log(await user.save());
  } catch (e) {
    console.log(e);
  }
}

async function leaveCommentOnBookAndChapter() {
  try {
    const book = await BookModel.create({ title: 'Sherlock holmes' });
    const chapter = await ChapterModel.create({ title: 'Chapter 1', book: book._id });
    const commentOnBook = await CommentModel.create({
      content: 'Great',
      doc: book._id,
      docModel: 'Book',
    });
    const commentOnChapter = await CommentModel.create({
      content: 'Very ...',
      doc: chapter._id,
      docModel: 'Chapter',
    });

    console.log(await CommentModel.find().populate('doc'));
  } catch (e) {
    console.log(e);
  }
}

async function addUserBooks() {
  try {
    const author = await UserModel.findOne({ lastName: 'Tiến' });
    const book1 = await BookModel.create({ title: 'Chuyến tàu tốc hành', author: author._id, tags: ['novel', 'detective'] });
    const book2 = await BookModel.create({ title: 'Sói và cừu', author: author._id, tags: ['literary', 'novel'] });
    const book3 = await BookModel.create({ title: 'Giết con chim nhại', author: author._id, tags: ['novel'] });
    const book4 = await BookModel.create({ title: 'Nhà giả kim', author: author._id, tags: ['novel'] });
  } catch (e) {
    console.log(e);
  }
}

async function listUserBooks() {
  try {
    log((await UserModel.findOne().populate('books')).books);
  } catch (e) {
    log(e);
  }
}

async function listStudentEmailUseAggregationSyntax() {
  try {
    console.log(await EmailModel.find({ $expr: { $regexMatch: {
      input: '$email',
      regex: /@student[.\w]+$/,
    } } }));
  } catch (e) {
    log(e);
  }
}

async function list() {
  try {
    const res = await CommentModel.insertMany([{ content: 'asd', doc: '636a2fb22e26eb35b6029583', docModel: 'Book' }, { content: 'asd', doc: '636a2fb22e26eb35b6029583', docModel: 'Book' }]);
    console.log(res);
  } catch (e) {
    log(e);
  }
}

list();

function log(result) {
  console.log(JSON.stringify(result));
}

console.log('==============================================');
