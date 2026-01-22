import express from 'express';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';

// Load environment variables
require('dotenv').config();

console.log('Starting auth service test...');

// Create the Neon connection
const connectionString = process.env.NEON_DATABASE_URL!;
if (!connectionString) {
  console.error('NEON_DATABASE_URL is not set in environment variables');
  process.exit(1);
}

try {
  const sql = neon(connectionString);
  const db = drizzle(sql as any);

  // Initialize Better Auth with minimal configuration to test if it loads properly
  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
    baseURL: "http://localhost:8001",
    trustHost: false, // Most important: disable trustHost
    emailAndPassword: {
      enabled: true,
    },
  });

  console.log('Better Auth initialized successfully!');

  // Create Express app
  const app = express();
  const PORT = 8001;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Auth Service Test' });
  });

  // Mount auth routes - but let's avoid the problematic endpoints initially
  app.use('/api/auth', async (req, res) => {
    console.log(`Received request to: ${req.method} ${req.url}`);

    // Log request headers for debugging
    console.log('Headers:', req.headers);

    // Convert Express request to WHATWG Request
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined && value !== null) {
        headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    }

    const request = new Request(`http://localhost:8001${req.url}`, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    // Pass to auth handler
    const response = await auth.handler(request);

    // Forward the response to Express
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await response.text();
    res.send(responseBody);
  });

  app.listen(PORT, () => {
    console.log(`Test auth service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log('Ready to test auth endpoints...');
  });

} catch (error) {
  console.error('Error initializing auth service:', error);
  process.exit(1);
}