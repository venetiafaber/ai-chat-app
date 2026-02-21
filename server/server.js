import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// imports routes
import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// loads environment variables first, before anything that uses process.env
dotenv.config();

// connects to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());    // to parson JSON string into JS object

app.get('/', (req, res) => {
  res.json({
    message: 'AI Chat App',
    version: '1.0',
    status: 'running'
  });
});
app.get('/about', (req, res) => {
  res.send('<h1>This is an AI chat application</h1>');
});
app.get('/api/time', (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.send(`Current Time: ${currentTime}`);
});

// API routes: middleware router - mount many routes(app.use) vs defining a route(app.get)
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// middleware - error handler (top down execution of middleware)
app.use(errorHandler);

// starts server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on and listening on port: ${PORT}`);
});

export default app;