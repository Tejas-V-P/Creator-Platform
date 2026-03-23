import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, io, next) => {
  try {
    // UPDATED: Added coverImage to destructuring
    const { title, content, category, status, coverImage } = req.body;

    if (!title || !content) {
      const error = new Error('Please provide title and content');
      error.status = 400;
      throw error;
    }

    // UPDATED: Added coverImage to the Post.create call
    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage: coverImage || null, // Stores the Cloudinary URL
      author: req.user._id
    });

    // Emit real-time event to all connected clients
    if (io) {
      io.emit('newPost', { title: post.title, author: req.user.name });
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    const total = await Post.countDocuments({ author: req.user._id });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized');
      error.status = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this post');
      error.status = 403;
      throw error;
    }

    // UPDATED: Added coverImage to destructuring and update logic
    const { title, content, category, status, coverImage } = req.body;
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.status = status || post.status;
    
    // If a new coverImage is provided in the body, update it.
    // If coverImage is explicitly null, it will remove the image reference.
    if (coverImage !== undefined) {
      post.coverImage = coverImage;
    }

    await post.save();

    res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this post');
      error.status = 403;
      throw error;
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};