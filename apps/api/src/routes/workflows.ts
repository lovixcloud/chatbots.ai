import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { bot: { workspaceId: req.workspaceId } },
      include: { bot: { select: { id: true, name: true } }, nodes: true, edges: true }
    });
    res.json({ success: true, data: workflows });
  } catch (err) { next(err); }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { botId, name, trigger, description, nodes, edges } = req.body;

    const workflow = await prisma.workflow.create({
      data: {
        botId,
        name,
        trigger: trigger || 'custom_flow',
        description,
        nodes: nodes ? { create: nodes } : undefined
      },
      include: { nodes: true, edges: true }
    });

    if (edges && edges.length > 0) {
      // Map temporary node IDs if necessary or create edges
      await prisma.workflowEdge.createMany({
        data: edges.map((e: any) => ({
          workflowId: workflow.id,
          sourceNodeId: e.sourceNodeId,
          targetNodeId: e.targetNodeId,
          condition: e.condition
        }))
      });
    }

    res.json({ success: true, data: workflow });
  } catch (err) { next(err); }
});

export default router;
