// import 'dotenv/config';
// import _ from 'lodash';
// import assert from 'assert';
// import fetch from 'node-fetch';
// import { mongo, redis } from '../../../src/services/index.js';
// import { UserModel, LinkModel } from '../../../src/models/index.js';
// import { serverUrl } from '../../../src/common/constants';

// describe.skip('/GET /links', () => {
//   before(async () => {
//     await mongo.connect();
//   });
//   let token;
//   let link;
//   let user;

//   // beforeEach('insert link', done => {
//   //   LinkModel.create({
//   //     rootLink: 'rootLink',
//   //     shortLink: 'shortLink',
//   //   }).then(data => {
//   //     link = data;
//   //     done();
//   //   }).catch(done);
//   // });

//   // beforeEach('insert user', done => {
//   //   UserModel.create({
//   //     username: 'username',
//   //     password: 'password',
//   //     links: [link._id],
//   //   }).then(data => {
//   //     user = data;
//   //     done();
//   //   }).catch(done);
//   // });

//   // beforeEach('generate access token', () => {
//   //   token = jwt.sign({ username: user.username }, security.jwtSecretKey, { expiresIn: '1d' });
//   // });

//   beforeEach(async () => {
//     link = await LinkModel.create({
//       ownerId: user ? user._id : null,
//       rootLink,
//       shortLink: shortID.generateID(),
//       isPublic: user ? isPublic : true,
//     });

//     user = await UserModel.create({
//       username: 'username',
//       password: 'password',
//       links: [link._id],
//     });
//     token = jwt.sign({ username: user.username }, security.jwtSecretKey, { expiresIn: '1d' });
//   });

//   afterEach(async () => {
//     await LinkModel.deleteOne({ shortLink: link.shortLink });
//     await UserModel.deleteOne({ username: user.username });
//   });

//   it('it should return user "username" with created links', done => {
//     fetch(`${serverUrl}user`, {
//       method: 'GET',
//       headers: new fetch.Headers({
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }),
//     }).then(res => {
//       assert.strictEqual(res.status, 200);
//       return res.json();
//     }).then(res => {
//       assert.strictEqual(res.username, 'username');
//       assert.strictEqual(res.links[0].shortLink, 'shortLink');
//       done();
//     }).catch(done);
//   });
// });
