import _ from 'lodash';
import assert from 'assert';
import { shortID } from '../../../src/modules/index.js';

describe('generateID()', () => {
  it('it should generate 100000 uniq ID continuously', () => {
    const obj = {};
    for (let i = 0; i < 100000; i += 1) {
      obj[shortID.generateID()] = 1;
    }
    assert.equal(_.size(obj), 100000);
  });
});
