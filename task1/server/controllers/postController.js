const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uniqueSlug } = require('../utils/slugify');

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Design', 'News'];

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

exports.getCategories = (_req, res) => {
  res.json({ categories: CATEGORIES });
};

exports.getPosts = async (req, res) => {
  const { q, category, tag, page = 1, limit = 9 } = req.query;
  const filter = { published: true };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  res.json({
    posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
  });
};

exports.getTags = async (_req, res) => {
  const tags = await Post.distinct('tags', { published: true });
  res.json({ tags: tags.filter(Boolean).sort() });
};

exports.getPostBySlug = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, published: true }).populate(
    'author',
    'name'
  );
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.views += 1;
  await post.save();

  const comments = await Comment.find({ post: post._id, status: 'approved' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json({ post, comments });
};

exports.createPost = async (req, res) => {
  const { title, excerpt, content, coverImage, category, tags, published } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Title, content, and category are required' });
  }

  const slug = await uniqueSlug(Post, title);
  const post = await Post.create({
    title,
    slug,
    excerpt: excerpt || '',
    content,
    coverImage: coverImage || '',
    category,
    tags: parseTags(tags),
    author: req.user._id,
    published: published !== false,
  });

  res.status(201).json({ post });
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const { title, excerpt, content, coverImage, category, tags, published } = req.body;
  if (title && title !== post.title) {
    post.title = title;
    post.slug = await uniqueSlug(Post, title, post._id);
  }
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (content !== undefined) post.content = content;
  if (coverImage !== undefined) post.coverImage = coverImage;
  if (category !== undefined) post.category = category;
  if (tags !== undefined) post.tags = parseTags(tags);
  if (published !== undefined) post.published = published;

  await post.save();
  res.json({ post });
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

exports.adminListPosts = async (req, res) => {
  const { q } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ];
  }
  const posts = await Post.find(filter).populate('author', 'name email').sort({ createdAt: -1 });
  res.json({ posts });
};

exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ post });
};
