import _ from 'lodash';
import assert from 'assert';
import { redisFunc } from '../../../src/modules/index.js';
import redis from '../../../src/services/redis.js';

describe('keyScan()', () => {
  before(async () => {
    const commands = [];
    for (let i = 0; i < 50; i += 1) {
      commands.push(redis.set(`key${i}`, i));
    }
    await Promise.all(commands);
  });
  after(async () => {
    const keys = await redis.keys('key*');
    await redis.del(keys);
  });
  it('it should list 50 keys match \\key*\\', async () => {
    const keys = await redisFunc.keyScan('key*');
    assert.equal(_.size(keys), 50);
  });
});
