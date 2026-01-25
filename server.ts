import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { requestLogger, errorHandler, attachUser } from './src/middleware/authMiddleware';
import profileRoutes from './src/routes/profile';
import skillsRoutes from './src/routes/skills';
import personalizationRoutes from './src/routes/personalization';
import queryRoutes from './src/routes/query';
import sessionRoutes from './src/routes/chatkit/session';

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser()); // Parse cookies
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Custom request logger
app.use(attachUser); // Attach user info to request

// Routes
// Proxy auth routes to auth service to handle better-auth integration
app.use('/api/auth', async (req, res) => {
  // Forward requests to the auth service running on port 8001
  const authServiceUrl = `http://localhost:8001${req.url}`;

  // Prepare headers, converting to compatible format to avoid TypeScript errors
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined && value !== null) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  // Set the Host header for Better Auth to work correctly
  headers['host'] = 'localhost:8001';
  headers['x-forwarded-host'] = req.get('host') || `localhost:${PORT}`;
  headers['x-forwarded-proto'] = req.protocol || 'http';
  headers['x-forwarded-for'] = req.ip || req.connection.remoteAddress || '';

  // Remove content-length to let fetch handle it
  delete headers['content-length'];

  try {
    const options: RequestInit = {
      method: req.method,
      headers: headers,
      ...(req.method !== 'GET' && req.method !== 'HEAD' ? {
        body: req.body instanceof Buffer ? req.body : JSON.stringify(req.body)
      } : {})
    };

    const response = await fetch(authServiceUrl, options);

    // Clone the response to be able to read it twice
    const responseClone = response.clone();

    // Check the content type to decide how to handle the response
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON response (like HTML error pages)
      const text = await responseClone.text();

      // If it's an HTML error page, return a more appropriate error
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        console.error('Auth service returned HTML error:', text.substring(0, 200));
        res.status(500).json({
          error: 'Authentication service is not available',
          message: 'Please try again later'
        });
      } else {
        res.status(response.status).send(text);
      }
    }
  } catch (error) {
    console.error('Auth proxy error:', error);

    // Return a meaningful error for signup/login flows to handle gracefully
    if (req.path.includes('/sign-up') || req.path.includes('/sign-in') || req.path.includes('/session')) {
      res.status(503).json({
        error: 'Authentication service is temporarily unavailable',
        code: 'AUTH_SERVICE_UNAVAILABLE',
        retryable: true
      });
    } else {
      res.status(500).json({ error: 'Failed to proxy auth request to auth service' });
    }
  }
});

// Proxy profile routes to auth service to handle better-auth integration
app.use('/api/profile', async (req, res) => {
  // Forward requests to the auth service running on port 8001
  const authServiceUrl = `http://localhost:8001${req.url}`;

  // Prepare headers, converting to compatible format to avoid TypeScript errors
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined && value !== null) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  // Set the Host header for Better Auth to work correctly
  headers['host'] = 'localhost:8001';
  headers['x-forwarded-host'] = req.get('host') || `localhost:${PORT}`;
  headers['x-forwarded-proto'] = req.protocol || 'http';
  headers['x-forwarded-for'] = req.ip || req.connection.remoteAddress || '';

  // Remove content-length to let fetch handle it
  delete headers['content-length'];

  try {
    const options: RequestInit = {
      method: req.method,
      headers: headers,
      ...(req.method !== 'GET' && req.method !== 'HEAD' ? {
        body: req.body instanceof Buffer ? req.body : JSON.stringify(req.body)
      } : {})
    };

    const response = await fetch(authServiceUrl, options);

    // Clone the response to be able to read it twice
    const responseClone = response.clone();

    // Check the content type to decide how to handle the response
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON response (like HTML error pages)
      const text = await responseClone.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('Profile proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request to auth service' });
  }
});

app.use(skillsRoutes);
app.use(personalizationRoutes);
app.use(queryRoutes);
app.use(sessionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;