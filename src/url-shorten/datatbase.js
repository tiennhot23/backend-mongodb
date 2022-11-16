/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { database } = require('./configs/dev.json');

class Database {
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(`mongodb://${database.host}:${database.port}/${database.database}`)
        .then(() => {
          console.log('Database connection successful');
          resolve();
        })
        .catch(err => {
          console.error('Database connection error', err);
          reject(err);
        });
    });
  }
}

module.exports = new Database();
