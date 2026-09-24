import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { categoryId, search } = req.query;

    const where: any = { workspaceId: req.workspaceId };
    if (categoryId) where.categoryId = categoryId as string;
    if (search) {
      where.OR = [
        { question: { contains: search as string, mode: 'insensitive' } },
        { answer: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      include: { category: true, tags: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    });

    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { question, answer, summary, categoryId, visibility, priority, isPublished } = req.body;

    const faq = await prisma.fAQ.create({
      data: {
        workspaceId: req.workspaceId!,
        question,
        answer,
        summary,
        categoryId,
        visibility: visibility || 'PUBLIC',
        priority: priority ? parseInt(priority) : 0,
        isPublished: isPublished ?? true
      },
      include: { category: true }
    });

    await prisma.auditLog.create({
      data: {
        workspaceId: req.workspaceId!,
        userId: req.user!.id,
        action: 'CREATE_FAQ',
        resource: 'FAQ',
        resourceId: faq.id
      }
    });

    res.json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { question, answer, summary, categoryId, visibility, priority, isPublished } = req.body;

    await prisma.fAQ.updateMany({
      where: { id, workspaceId: req.workspaceId },
      data: { question, answer, summary, categoryId, visibility, priority, isPublished }
    });

    const updated = await prisma.fAQ.findUnique({
      where: { id },
      include: { category: true, tags: true }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.fAQ.deleteMany({
      where: { id, workspaceId: req.workspaceId }
    });

    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
});

export default router;
