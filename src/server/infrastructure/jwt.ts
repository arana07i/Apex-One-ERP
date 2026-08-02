import jwt from 'jsonwebtoken';
import { JwtPayload, User } from '../../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'enterprise-erp-super-secret-key-2026';

export class JwtAuthProvider {
  /**
   * Generate signed JWT token for User
   */
  static signToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }
}
