import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { signToken, authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, workspaceName } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Name, email and password are required' } });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, error: { code: 'EMAIL_EXISTS', message: 'User with this email already exists' } });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });

    const wsName = workspaceName || `${name}'s Workspace`;
    const slug = wsName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const workspace = await prisma.workspace.create({
      data: {
        name: wsName,
        slug
      }
    });

    const ownerRole = await prisma.role.create({
      data: {
        workspaceId: workspace.id,
        name: 'Owner',
        roleType: 'OWNER',
        isSystem: true
      }
    });

    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        roleId: ownerRole.id
      }
    });

    const token = signToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, isSuperAdmin: user.isSuperAdmin },
        workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug }
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
      return;
    }

    const token = signToken(user);

    const members = await prisma.workspaceMember.findMany({
      where: { userId: user.id },
      include: { workspace: true, role: true }
    });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, isSuperAdmin: user.isSuperAdmin, avatar: user.avatar },
        workspaces: members.map((m: any) => ({ id: m.workspace.id, name: m.workspace.name, slug: m.workspace.slug, role: m.role.roleType }))
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, avatar: true, jobTitle: true, isSuperAdmin: true }
    });

    const members = await prisma.workspaceMember.findMany({
      where: { userId: req.user!.id },
      include: { workspace: true, role: true }
    });

    res.json({
      success: true,
      data: {
        user,
        workspaces: members.map((m: any) => ({ id: m.workspace.id, name: m.workspace.name, slug: m.workspace.slug, role: m.role.roleType, logo: m.workspace.logo }))
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
