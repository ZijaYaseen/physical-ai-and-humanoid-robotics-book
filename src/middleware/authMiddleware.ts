import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

// Middleware to attach user info to request
export const attachUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Attempt to get session from Better Auth
    // This is a simplified approach - in practice, you'd use Better Auth's session handling
    const token = req.cookies['better-auth.session_token'] ||
                  req.headers.authorization?.split(' ')[1] ||
                  (req.headers as any)['x-session-token'];

    if (token) {
      // In a real implementation, you would verify the session with Better Auth
      // const session = await auth.getSession({ token });

      // For now, we'll add a placeholder that would be replaced with actual session data
      (req as any).user = { id: 'placeholder-user-id', authenticated: true, sessionToken: token };
    } else {
      (req as any).user = { authenticated: false };
    }

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    // Log more detailed error info for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    (req as any).user = { authenticated: false };
    next();
  }
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};