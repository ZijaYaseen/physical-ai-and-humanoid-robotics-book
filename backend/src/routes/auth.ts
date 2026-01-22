import * as express from 'express';
import auth from '../lib/auth';
import type { Request as ExpressRequest } from 'express';

const router = express.Router();

// Define a type for headers that can be converted to HeadersInit
type HeadersLike = Record<string, string | string[]>;

// Convert Express headers to fetch-compatible headers
function convertHeaders(headers: HeadersLike): HeadersInit {
  const result: HeadersInit = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
    } else if (typeof value === 'string') {
      result[key] = value;
    }
  }
  return result;
}

// Mount Better Auth API routes
router.use('/api/auth', (req: ExpressRequest, res) => {
  const { method, url, headers, body } = req;
  const convertedHeaders = convertHeaders(headers);
  const request = new Request(`http://localhost${url}`, {
    method,
    headers: convertedHeaders,
    body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
  });

  // Handle the auth request
  auth.handler(request).then(response => {
    // Forward the response to the client
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    response.text().then(text => {
      res.send(text);
    }).catch(() => {
      // If text() fails, send empty response
      res.end();
    });
  });
});

// GET /api/auth/me - Get current user
router.get('/api/auth/me', async (req: ExpressRequest, res) => {
  try {
    // Extract session token from cookies or headers
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ error: 'No session found' });
    }

    // For now, return a placeholder - the actual implementation depends on Better Auth's session handling
    // This will be properly implemented when we know the exact Better Auth API
    res.json({
      user: null,
      authenticated: false
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// POST /api/auth/signout
router.post('/api/auth/signout', async (req: ExpressRequest, res) => {
  try {
    // Placeholder for signout - will implement with Better Auth's API
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign out' });
  }
});

export default router;