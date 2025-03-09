const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { createRateLimitMiddleware, defaultRateLimits } = require('./lib/rate-limit');
const cors = require('cors');

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Middleware with enhanced CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https://*.supabase.co'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  })
);

// Rate Limiting for different endpoints
const apiLimiter = createRateLimitMiddleware(defaultRateLimits.api);
const speechLimiter = createRateLimitMiddleware(defaultRateLimits.speech);
const authLimiter = createRateLimitMiddleware(defaultRateLimits.auth);

// Apply rate limiting to specific routes
app.use('/api/', apiLimiter);
app.use('/api/speech', speechLimiter);
app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets with optimized caching
app.use(
  express.static('.next', {
    maxAge: '1y',
    immutable: true,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        // No cache for HTML files
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        // Long cache for static assets
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Client-Side Routing - Always return the Next.js handler for non-API routes
app.get('*', (req, res) => {
  // For Next.js apps, we should forward to the Next.js server
  // This is a fallback that will at least show a message to the user
  res.status(200).send(`
    <html>
      <head>
        <title>Digital Brain Agency</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .message { margin-top: 50px; }
          .error { color: #e74c3c; }
          .info { color: #3498db; }
        </style>
      </head>
      <body>
        <h1>Digital Brain Agency</h1>
        <div class="message">
          <p class="info">Backend server is running on port ${PORT}.</p>
          <p>To view the frontend, please run <code>npm run dev</code> in a separate terminal.</p>
          <p class="error">The Next.js frontend is not currently running or built.</p>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
