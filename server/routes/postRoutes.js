import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createPost, 
  getPosts, 
  getPostById,   // Import new controller
  updatePost,    // Import new controller
  deletePost     // Import new controller
} from '../controllers/postController.js';

const router = express.Router();

// Routes for base collection
router.route('/')
  .post(protect, createPost)
  .get(protect, getPosts);

// Routes for individual posts
// The :id parameter allows us to target specific resources
router.route('/:id')
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;