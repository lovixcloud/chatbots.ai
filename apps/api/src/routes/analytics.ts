import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/overview', async (req: AuthRequest, res, next) => {
  try {
    const workspaceId = req.workspaceId!;

    const [
      totalConversations,
      activeConversations,
      resolvedConversations,
      escalatedConversations,
      totalCustomers,
      totalBots,
      totalFAQs,
      unresolvedQuestions
    ] = await Promise.all([
      prisma.conversation.count({ where: { workspaceId } }),
      prisma.conversation.count({ where: { workspaceId, status: { in: ['NEW', 'OPEN', 'WAITING'] } } }),
      prisma.conversation.count({ where: { workspaceId, status: 'RESOLVED' } }),
      prisma.conversation.count({ where: { workspaceId, status: 'ESCALATED' } }),
      prisma.customer.count({ where: { workspaceId } }),
      prisma.bot.count({ where: { workspaceId } }),
      prisma.fAQ.count({ where: { workspaceId } }),
      prisma.conversation.findMany({
        where: { workspaceId, isUnresolvedQuestion: true },
        select: { id: true, unresolvedText: true, createdAt: true, bot: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    const resolutionRate = totalConversations > 0 ? Math.round((resolvedConversations / totalConversations) * 100) : 0;
    const handoffRate = totalConversations > 0 ? Math.round((escalatedConversations / totalConversations) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalConversations,
        activeConversations,
        resolvedConversations,
        escalatedConversations,
        totalCustomers,
        totalBots,
        totalFAQs,
        resolutionRate,
        handoffRate,
        unresolvedQuestions
      }
    });
  } catch (err) { next(err); }
});

export default router;
