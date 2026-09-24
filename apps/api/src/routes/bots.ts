import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate, requireWorkspaceAccess, AuthRequest } from '../middleware/auth.js';
import { matchRules } from '@chatbots-ai/shared';

const router = Router();

router.use(authenticate, requireWorkspaceAccess);

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const bots = await prisma.bot.findMany({
      where: { workspaceId: req.workspaceId },
      include: {
        theme: true,
        widgetConfig: true,
        _count: {
          select: { rules: true, workflows: true, conversations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: bots });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const bot = await prisma.bot.findFirst({
      where: { id, workspaceId: req.workspaceId },
      include: {
        theme: true,
        widgetConfig: true,
        rules: { include: { conditions: true, actions: true } },
        workflows: { include: { nodes: true, edges: true } }
      }
    });

    if (!bot) {
      res.status(404).json({ success: false, error: { code: 'BOT_NOT_FOUND', message: 'Chatbot not found' } });
      return;
    }

    res.json({ success: true, data: bot });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { name, description, welcomeMessage, fallbackResponse, offlineResponse, language, tone, theme } = req.body;

    const identifier = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);

    const bot = await prisma.bot.create({
      data: {
        workspaceId: req.workspaceId!,
        name,
        identifier,
        description,
        welcomeMessage: welcomeMessage || 'Hello! How can I help you today?',
        fallbackResponse: fallbackResponse || 'I could not find an exact match for that question.',
        offlineResponse: offlineResponse || 'Our agents are currently offline.',
        language: language || 'en',
        tone: tone || 'friendly',
        theme: {
          create: {
            primaryColor: theme?.primaryColor || '#2563eb',
            secondaryColor: theme?.secondaryColor || '#1d4ed8',
            headerTitle: theme?.headerTitle || name
          }
        },
        widgetConfig: {
          create: {
            allowedDomains: ['*'],
            quickReplies: [
              { label: 'Track Order', payload: 'order_status' },
              { label: 'Return Policy', payload: 'return_policy' },
              { label: 'Talk to Agent', payload: 'agent_handoff' }
            ]
          }
        }
      },
      include: { theme: true, widgetConfig: true }
    });

    await prisma.auditLog.create({
      data: {
        workspaceId: req.workspaceId!,
        userId: req.user!.id,
        action: 'CREATE_BOT',
        resource: 'Bot',
        resourceId: bot.id
      }
    });

    res.json({ success: true, data: bot });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { name, description, status, welcomeMessage, fallbackResponse, offlineResponse, language, tone, humanHandoffEnabled, handoffKeywords, theme, widgetConfig } = req.body;

    await prisma.bot.updateMany({
      where: { id, workspaceId: req.workspaceId },
      data: {
        name,
        description,
        status,
        welcomeMessage,
        fallbackResponse,
        offlineResponse,
        language,
        tone,
        humanHandoffEnabled,
        handoffKeywords
      }
    });

    if (theme) {
      await prisma.botTheme.upsert({
        where: { botId: id },
        update: theme,
        create: { botId: id, ...theme }
      });
    }

    if (widgetConfig) {
      await prisma.widgetConfiguration.upsert({
        where: { botId: id },
        update: widgetConfig,
        create: { botId: id, ...widgetConfig }
      });
    }

    const updatedBot = await prisma.bot.findUnique({
      where: { id },
      include: { theme: true, widgetConfig: true }
    });

    res.json({ success: true, data: updatedBot });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.bot.deleteMany({
      where: { id, workspaceId: req.workspaceId }
    });

    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/playground', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { message, contextVariables } = req.body;

    const bot = await prisma.bot.findFirst({
      where: {
        OR: [{ id }, { identifier: id }],
        workspaceId: req.workspaceId
      },
      include: {
        rules: { include: { conditions: true, actions: true } },
        workflows: { include: { nodes: true, edges: true } }
      }
    });

    if (!bot) {
      res.status(404).json({ success: false, error: { code: 'BOT_NOT_FOUND', message: 'Chatbot not found' } });
      return;
    }

    const rules = bot.rules.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      matchType: r.matchType as any,
      triggers: r.triggers,
      priority: r.priority,
      isActive: r.isActive,
      response: r.response,
      quickReplies: r.quickReplies,
      conditions: r.conditions,
      actions: r.actions
    }));

    const ruleResult = matchRules(message || '', rules, contextVariables || {});

    let retrievedRecords: any = null;
    if (ruleResult.actions) {
      for (const act of ruleResult.actions) {
        if (act.actionType === 'FETCH_COLLECTION' && act.targetKey) {
          retrievedRecords = await prisma.customRecord.findMany({
            where: { collection: { slug: act.targetKey, workspaceId: req.workspaceId } },
            take: 5
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        inputMessage: message,
        matchedRule: ruleResult.matched ? ruleResult : null,
        retrievedRecords,
        finalResponse: ruleResult.matched ? ruleResult.response : bot.fallbackResponse,
        quickReplies: ruleResult.matched ? ruleResult.quickReplies : []
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
