const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  doc: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `onModel` property to find the right model.
    refPath: 'docModel',
  },
  docModel: {
    type: String,
    required: true,
    enum: ['Book', 'Chapter'],
  },
});

module.exports = mongoose.model('Comment', commentSchema);
