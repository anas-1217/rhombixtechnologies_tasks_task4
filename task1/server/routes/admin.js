const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createPost,
  updatePost,
  deletePost,
  adminListPosts,
  getPostById,
} = require('../controllers/postController');
const {
  adminListComments,
  updateCommentStatus,
  deleteComment,
} = require('../controllers/commentController');
const { stats, listUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { uploadImage } = require('../controllers/uploadController');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', stats);

router.get('/posts', adminListPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

router.post('/upload', upload.single('image'), uploadImage);

router.get('/comments', adminListComments);
router.patch('/comments/:id', updateCommentStatus);
router.delete('/comments/:id', deleteComment);

router.get('/users', listUsers);
router.patch('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
