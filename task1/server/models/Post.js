const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
