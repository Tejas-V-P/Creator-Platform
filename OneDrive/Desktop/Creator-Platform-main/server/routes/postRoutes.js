import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} from '../controllers/postController.js';

const router = express.Router();

// We export a function that takes 'io' as an argument
export default (io) => {
  
  // Routes for base collection
  router.route('/')
    // Pass 'io' into the controller using a wrapper function
    .post(protect, (req, res, next) => createPost(req, res, io, next))
    .get(protect, getPosts);

  // Routes for individual posts
  router.route('/:id')
    .get(protect, getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

  return router;
};