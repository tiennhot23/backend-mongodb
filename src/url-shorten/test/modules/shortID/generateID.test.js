const _ = require('lodash');
const assert = require('assert');
const { shortID } = require('../../../modules');

describe('generateID()', () => {
  it('it should generate 100000 uniq ID continuously', () => {
    const obj = {};
    for (let i = 0; i < 100000; i += 1) {
      obj[shortID.generateID()] = 1;
    }
    assert.equal(_.size(obj), 100000);
  });
});
