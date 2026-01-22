import express from 'express';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';
import profileRoutes from './profile-routes';
require('dotenv').config(); // Load environment variables

// Helper function to get raw body from request
const getRawBody = async (req: express.Request): Promise<string | Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
};

// Create the Neon connection
const connectionString = process.env.NEON_DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql as any);

// Initialize Better Auth with Neon database using the Drizzle adapter
const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL provider
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  baseURL: "http://localhost:8001",
  trustHost: false, // Disable trustHost to avoid URL parsing issues
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: parseInt(process.env.SESSION_EXPIRES_IN_DAYS || "30") * 24 * 60 * 60, // Convert days to seconds
  },
});

// Get the handler from Better Auth
const authHandler = auth.handler;

// Create Express app
const app = express();
const PORT = process.env.PORT || 8001;

// Essential middleware for proper request context
app.set('trust proxy', true); // Trust proxy for proper host/protocol detection
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Use JSON middleware for non-auth routes
app.use('/api/profile', express.json({ limit: '1mb' }));

// Use Better Auth handler directly
app.use("/api/auth", async (req, res) => {
  try {
    // Get the raw body from the request
    let rawBody = '';
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.setEncoding('utf8');
      for await (const chunk of req) {
        rawBody += chunk;
      }
    }

    const request = new Request(`http://localhost:8001${req.url}`, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== 'GET' && req.method !== 'HEAD' && rawBody ? rawBody : undefined,
    });

    // Call the Better Auth handler
    const response = await auth.handler(request);

    // Send the response back to Express
    res.status(response.status);

    // Copy all headers
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // Get the response body and send it
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Better Auth error:', error);
    res.status(500).json({
      error: 'Authentication service error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mount profile API routes
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'Better Auth Service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Better Auth Service is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Better Auth API available at http://localhost:${PORT}/api/auth`);
  console.log(`Profile API available at http://localhost:${PORT}/api/profile`);
});

export default app;