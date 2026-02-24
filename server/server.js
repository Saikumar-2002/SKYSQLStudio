require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectMongoDB = require('./config/db');
const { testPgConnection } = require('./config/pgPool');

const app = express();
const PORT = process.env.PORT || 5000;
const DEMO_MODE = process.env.DEMO_MODE === 'false';

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Stricter rate limit for SQL execution
const executeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Too many queries. Please wait a moment.' }
});
app.use('/api/execute', executeLimiter);

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/hints', require('./routes/hints'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', demoMode: DEMO_MODE, timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --------------- Start Server ---------------
async function startServer() {
  try {
    if (!DEMO_MODE) {
      await connectMongoDB();
      await testPgConnection();
      console.log('✅ All database connections established');
    } else {
      console.log('🎮 Running in DEMO MODE — no database connections required');
    }

    app.listen(PORT, () => {
      console.log(`🚀 SKYSQLStudio server running on http://localhost:${PORT}`);
      console.log(`   Mode: ${DEMO_MODE ? 'DEMO' : 'PRODUCTION'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
