import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    isSuperAdmin: boolean;
  };
  workspaceId?: string;
  workspaceRole?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-chatbots-ai-2025';

export function signToken(user: { id: string; email: string; name: string; isSuperAdmin: boolean }): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, isSuperAdmin: user.isSuperAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, isSuperAdmin: true }
    });

    if (!user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
}

export async function requireWorkspaceAccess(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
      return;
    }

    const workspaceId = (req.headers['x-workspace-id'] as string) || (req.query.workspaceId as string) || (req.body.workspaceId as string);

    if (!workspaceId) {
      const member = await prisma.workspaceMember.findFirst({
        where: { userId: req.user.id },
        select: { workspaceId: true, role: { select: { roleType: true } } }
      });

      if (!member) {
        res.status(403).json({ success: false, error: { code: 'NO_WORKSPACE', message: 'No active workspace found for user' } });
        return;
      }

      req.workspaceId = member.workspaceId;
      req.workspaceRole = member.role.roleType;
      next();
      return;
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: req.user.id
        }
      },
      select: { workspaceId: true, role: { select: { roleType: true } } }
    });

    if (!member && !req.user.isSuperAdmin) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied for specified workspace' } });
      return;
    }

    req.workspaceId = workspaceId;
    req.workspaceRole = member ? member.role.roleType : 'ADMINISTRATOR';
    next();
  } catch (err) {
    next(err);
  }
}
