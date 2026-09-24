import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const rules = await prisma.botRule.findMany({
      where: { bot: { workspaceId: req.workspaceId } },
      include: { bot: { select: { id: true, name: true } }, conditions: true, actions: true },
      orderBy: { priority: 'desc' }
    });
    res.json({ success: true, data: rules });
  } catch (err) { next(err); }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { botId, name, category, matchType, triggers, priority, response, quickReplies, actions } = req.body;

    const rule = await prisma.botRule.create({
      data: {
        botId,
        name,
        category,
        matchType: matchType || 'EXACT_KEYWORD',
        triggers: Array.isArray(triggers) ? triggers : triggers.split(',').map((s: string) => s.trim()),
        priority: priority ? parseInt(priority) : 10,
        response,
        quickReplies,
        actions: actions ? { create: actions } : undefined
      },
      include: { actions: true }
    });

    res.json({ success: true, data: rule });
  } catch (err) { next(err); }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { name, category, matchType, triggers, priority, isActive, response, quickReplies } = req.body;

    const updated = await prisma.botRule.update({
      where: { id },
      data: {
        name,
        category,
        matchType,
        triggers: Array.isArray(triggers) ? triggers : triggers.split(',').map((s: string) => s.trim()),
        priority,
        isActive,
        response,
        quickReplies
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.botRule.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
});

export default router;
