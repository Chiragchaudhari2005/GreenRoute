require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const seedData = require('./seeds/seedData');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration supporting Vite dev server & custom ports
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // Allow any localhost / 127.0.0.1 port for developer ease
      if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (origin === clientOrigin) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all in dev mode
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GreenRoute — Waste Pickup Scheduling Platform API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await connectDB();

      // Automatically seed if the database is brand new
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[GreenRoute] Initializing starter seed data...');
        await seedData(false);
      }

      server = app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 GreenRoute API running on http://localhost:${PORT}`);
        console.log(`🌿 Health check at http://localhost:${PORT}/api/health`);
        console.log(`=======================================================`);
      });
    } catch (err) {
      console.error('[GreenRoute Init Error]:', err.message);
      process.exit(1);
    }
  })();
}

module.exports = app;
