/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const { database } = require('../configs/dev.json');

// connect mongoose
mongoose.connect(`mongodb://${database.host}:${database.port}/${database.database}`)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('Error: MongoDB:::', err));

// // all executed methods log output to console
// mongoose.set('debug', true);

// // disable colors in debug mode
// mongoose.set('debug', { color: false });

// // get mongodb-shell friendly output (ISODate)
// mongoose.set('debug', { shell: true });

module.exports = mongoose;
