const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  const { body } = req.body;
  if (!body || !body.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }

  const post = await Post.findById(req.params.postId);
  if (!post || !post.published) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = await Comment.create({
    post: post._id,
    user: req.user._id,
    name: req.user.name,
    body: body.trim(),
    status: 'approved',
  });

  const populated = await comment.populate('user', 'name');
  res.status(201).json({ comment: populated });
};

exports.adminListComments = async (_req, res) => {
  const comments = await Comment.find()
    .populate('user', 'name email')
    .populate('post', 'title slug')
    .sort({ createdAt: -1 });
  res.json({ comments });
};

exports.updateCommentStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'hidden'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const comment = await Comment.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('user', 'name email')
    .populate('post', 'title slug');
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  res.json({ comment });
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};
