import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutesFactory from './routes/postRoutes.js';
// 1. Import the new upload routes
import uploadRoutes from './routes/upload.js';
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error: Invalid token'));
    socket.data.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${socket.id} (${reason})`);
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutesFactory(io));
// 2. Register the upload route
app.use('/api/upload', uploadRoutes); 

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Error handler must be last
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});