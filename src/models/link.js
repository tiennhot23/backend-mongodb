/* eslint-disable func-names */
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rootLink: String,
  shortLink: { type: String, unique: true },
  isPublic: { type: Boolean, default: true },
  numberOfClick: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export default mongoose.model('Link', linkSchema);
