/* eslint-disable func-names */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  enabled: { type: Boolean, default: true },
});

export default mongoose.model('User', userSchema);
