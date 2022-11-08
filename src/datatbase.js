/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'test';

class Database {
  connect() {
    mongoose.connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error('Database connection error', err);
      });
  }
}

module.exports = new Database();
