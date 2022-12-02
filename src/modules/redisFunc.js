/* eslint-disable no-await-in-loop */
import { redis } from '../services/index.js';

async function keyScan(pattern, count = 20) {
  const result = [];
  let cursor = 0;
  do {
    // return [string cursor, string[] elements]
    // read redis.md: Data structures notes to understand more about scan
    const [curs, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    cursor = curs;
    result.push(...keys);
  } while (cursor !== '0');
  return result;
}

export default { keyScan };
