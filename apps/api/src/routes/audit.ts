import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { workspaceId: req.workspaceId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

export default router;
