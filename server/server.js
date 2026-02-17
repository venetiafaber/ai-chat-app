import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// loads environment variables first, before anything that uses process.env
dotenv.config();

// connects to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

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

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

export default app;