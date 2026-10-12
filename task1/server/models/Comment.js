const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'approved' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
