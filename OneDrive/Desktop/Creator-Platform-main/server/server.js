import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
// 🆕 ADDED: Import HTTP and Socket.io modules
import { createServer } from 'http'; 
import { Server } from 'socket.io';  

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 🆕 ADDED: Create HTTP server from the Express app
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));

app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date()
  });
});

// 🆕 ADDED: Initialize Socket.io with its own CORS config
const io = new Server(httpServer, {
  cors: {
    // Note: I matched this to port 5174 based on your Express CORS config above
    origin: process.env.CLIENT_URL || 'http://localhost:5174', 
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 🆕 ADDED: Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${socket.id} (${reason})`);
  });
});

// 🔄 CHANGED: Replaced app.listen with httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`); // 🆕 ADDED log
});