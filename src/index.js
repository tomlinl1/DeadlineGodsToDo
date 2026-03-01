import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import uri from './util/uri.js';
import userRoutes from "./routes/userRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import postRoutes from './routes/posts.js';
import listRoutes from './routes/list.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use("/api/users", userRoutes);
app.use("/api/achievements", achievementRoutes);

// Routes
app.use('/', postRoutes);
app.use('/list', listRoutes);

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  app.listen(5500, () => {
    console.log('Server listening on port 5500');
  });
}

await start();
