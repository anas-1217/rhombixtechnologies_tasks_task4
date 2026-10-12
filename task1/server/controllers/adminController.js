const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.stats = async (_req, res) => {
  const [users, posts, comments, published] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
    Post.countDocuments({ published: true }),
  ]);
  res.json({ users, posts, comments, published });
};

exports.listUsers = async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  if (String(req.user._id) === String(req.params.id) && role !== 'admin') {
    return res.status(400).json({ message: 'You cannot remove your own admin role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    '-password'
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
};

exports.deleteUser = async (req, res) => {
  if (String(req.user._id) === String(req.params.id)) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};
