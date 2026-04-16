import express from 'express';
import { protect } from '../middleware/auth.js';
import timingMiddleware from '../middleware/timing.js'; // ⏱️ New import
import { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} from '../controllers/postController.js';

const router = express.Router();

export default (io) => {
  // Apply timing middleware to all post routes to monitor performance
  router.use(timingMiddleware);

  // Routes for base collection
  router.route('/')
    .post(protect, (req, res, next) => createPost(req, res, io, next))
    .get(protect, getPosts); // 🚀 Optimization happens inside getPosts controller

  // Routes for individual posts
  router.route('/:id')
    .get(protect, getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

  return router;
};