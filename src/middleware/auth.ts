import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.js';
import { JwtAuthProvider } from '../server/infrastructure/jwt.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { User, Role } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }

  try {
    // 1. Try Firebase ID token verification
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const uid = decodedToken.uid;
      const email = decodedToken.email || '';

      // Fetch or insert user record in Cloud SQL
      const [dbUser] = await db.select().from(users).where(eq(users.uid, uid));

      if (dbUser) {
        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as Role,
          department: dbUser.department || 'Operations',
          lastLogin: dbUser.lastLogin || new Date().toISOString(),
          avatarUrl: dbUser.avatarUrl || undefined,
        };
      } else {
        // Insert user into Postgres
        const name = decodedToken.name || email.split('@')[0] || 'User';
        const newUserId = `usr-${Date.now()}`;
        const [insertedUser] = await db
          .insert(users)
          .values({
            id: newUserId,
            uid,
            email,
            name,
            role: Role.Admin,
            department: 'Executive Operations',
            lastLogin: new Date().toISOString(),
          })
          .returning();

        req.user = {
          id: insertedUser.id,
          email: insertedUser.email,
          name: insertedUser.name,
          role: insertedUser.role as Role,
          department: insertedUser.department || 'Executive Operations',
          lastLogin: insertedUser.lastLogin || new Date().toISOString(),
        };
      }

      return next();
    } catch (fbErr) {
      // 2. Fallback to application JWT verification (for seeded/JWT logins)
      const jwtPayload = JwtAuthProvider.verifyToken(token);
      if (jwtPayload) {
        const [dbUser] = await db.select().from(users).where(eq(users.id, jwtPayload.userId));
        if (dbUser) {
          req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role as Role,
            department: dbUser.department || 'Operations',
            lastLogin: dbUser.lastLogin || new Date().toISOString(),
            avatarUrl: dbUser.avatarUrl || undefined,
          };
          return next();
        }
      }

      console.error('Auth verification failed:', fbErr);
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication error' });
  }
};

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'Guest'}' lacks permission. Required: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
}
