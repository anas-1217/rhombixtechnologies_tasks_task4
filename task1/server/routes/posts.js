const express = require('express');
const {
  getPosts,
  getPostBySlug,
  getCategories,
  getTags,
} = require('../controllers/postController');
const { createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPosts);
router.get('/meta/categories', getCategories);
router.get('/meta/tags', getTags);
router.get('/:slug', getPostBySlug);
router.post('/:postId/comments', protect, createComment);

module.exports = router;
