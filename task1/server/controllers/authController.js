const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role: 'user' });
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
