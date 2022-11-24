/* eslint-disable no-console */
const { createClient } = require('redis');

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

redis.connect()
  .then(_ => console.log('Redis connected!'))
  .catch(error => console.error('Error: Redis:::', error));

module.exports = redis;
