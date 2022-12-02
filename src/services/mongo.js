/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import mongoose from 'mongoose';

// connect mongoose
function connect() {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.error('Error: MongoDB:::', err));
}

export default { connect };
