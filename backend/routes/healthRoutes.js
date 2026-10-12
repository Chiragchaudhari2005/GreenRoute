const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @desc    Application Health Check Endpoint for CI/CD and Docker/Kubernetes/Jenkins
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = mongoose.connection.readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'greenroute-backend-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'greenroute',
    },
  });
});

module.exports = router;
