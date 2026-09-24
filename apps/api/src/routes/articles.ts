import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const articles = await prisma.knowledgeArticle.findMany({
      where: { workspaceId: req.workspaceId },
      include: { category: true, tags: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: articles });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { title, content, summary, categoryId, status, visibility } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const article = await prisma.knowledgeArticle.create({
      data: {
        workspaceId: req.workspaceId!,
        title,
        slug,
        content,
        summary,
        categoryId,
        status: status || 'PUBLISHED',
        visibility: visibility || 'PUBLIC'
      },
      include: { category: true }
    });

    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
});

export default router;
