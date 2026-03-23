import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true   // Index for filtering by author
  },
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Compound index: filter + sort
postSchema.index({ author: 1, createdAt: -1 });

// Index for global feed sorting
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);