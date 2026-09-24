import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { status, assignedAgentId, search } = req.query;

    const where: any = { workspaceId: req.workspaceId };
    if (status) where.status = status as string;
    if (assignedAgentId) where.assignedAgentId = assignedAgentId as string;

    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { customer: { name: { contains: search as string, mode: 'insensitive' } } },
        { customer: { email: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        bot: { select: { id: true, name: true } },
        customer: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    res.json({ success: true, data: conversations });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const conversation = await prisma.conversation.findFirst({
      where: { id, workspaceId: req.workspaceId },
      include: {
        bot: true,
        customer: true,
        variables: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { senderUser: { select: { id: true, name: true, avatar: true } } }
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
      return;
    }

    res.json({ success: true, data: conversation });
  } catch (err) { next(err); }
});

router.post('/:id/messages', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { content, isInternalNote } = req.body;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderType: 'AGENT',
        senderUserId: req.user!.id,
        content,
        isInternalNote: Boolean(isInternalNote)
      },
      include: { senderUser: { select: { id: true, name: true, avatar: true } } }
    });

    await prisma.conversation.update({
      where: { id },
      data: {
        lastMessageAt: new Date(),
        status: isInternalNote ? undefined : 'OPEN'
      }
    });

    res.json({ success: true, data: message });
  } catch (err) { next(err); }
});

router.put('/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { status, assignedAgentId } = req.body;

    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        status,
        assignedAgentId: assignedAgentId !== undefined ? assignedAgentId : undefined,
        endedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : undefined
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;
