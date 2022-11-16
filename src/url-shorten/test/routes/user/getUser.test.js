const jwt = require('jsonwebtoken');
const assert = require('assert');
const fetch = require('node-fetch');
const database = require('../../../datatbase');
const { UserModel, LinkModel } = require('../../../models');
const { security, serverUrl } = require('../../../configs/dev.json');

describe.skip('/GET /user', () => {
  before(async () => {
    await database.connect();
  });
  let token;
  let link;
  let user;

  // beforeEach('insert link', done => {
  //   LinkModel.create({
  //     rootLink: 'rootLink',
  //     shortLink: 'shortLink',
  //   }).then(data => {
  //     link = data;
  //     done();
  //   }).catch(done);
  // });

  // beforeEach('insert user', done => {
  //   UserModel.create({
  //     username: 'username',
  //     password: 'password',
  //     links: [link._id],
  //   }).then(data => {
  //     user = data;
  //     done();
  //   }).catch(done);
  // });

  // beforeEach('generate access token', () => {
  //   token = jwt.sign({ username: user.username }, security.jwtSecretKey, { expiresIn: '1d' });
  // });

  beforeEach(async () => {
    link = await LinkModel.create({
      rootLink: 'rootLink',
      shortLink: 'shortLink',
    });

    user = await UserModel.create({
      username: 'username',
      password: 'password',
      links: [link._id],
    });
    token = jwt.sign({ username: user.username }, security.jwtSecretKey, { expiresIn: '1d' });
  });

  afterEach(async () => {
    await LinkModel.deleteOne({ shortLink: link.shortLink });
    await UserModel.deleteOne({ username: user.username });
  });

  it('it should return user "username" with created links', done => {
    fetch(`${serverUrl}user`, {
      method: 'GET',
      headers: new fetch.Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    }).then(res => {
      assert.strictEqual(res.status, 200);
      return res.json();
    }).then(res => {
      assert.strictEqual(res.username, 'username');
      assert.strictEqual(res.links[0].shortLink, 'shortLink');
      done();
    }).catch(done);
  });
});
