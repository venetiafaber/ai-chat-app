import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middleware/errorHandler.js';

// loads environment variables first, before anything that uses process.env
dotenv.config();

// connects to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());    // to parson JSON string into JS object

app.get('/', (req, res) => {
  res.send('Hello from the backend! ');
});
app.get('/about', (req, res) => {
  res.send('<h1>This is an AI chat application</h1>');
});
app.get('/api/time', (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.send(`Current Time: ${currentTime}`);
});

// user routes
app.use('/api/users', userRoutes);  // middleware router - mount many routes(app.use) vs defining a route(app.get)

// middleware - error handler (top down execution of middleware)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

export default app;