import { Router } from 'express';
import { prisma } from '../db.js';
import { matchRules, rankSearchResults, executeWorkflowStep } from '@chatbots-ai/shared';

const router = Router();

router.get('/config/:botId', async (req, res, next) => {
  try {
    const { botId } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        OR: [{ id: botId }, { identifier: botId }],
        status: 'PUBLISHED'
      },
      include: {
        theme: true,
        widgetConfig: true,
        workspace: { select: { id: true, name: true, logo: true, businessHours: true } }
      }
    });

    if (!bot) {
      res.status(404).json({ success: false, error: { code: 'BOT_NOT_FOUND', message: 'Published bot not found' } });
      return;
    }

    res.json({
      success: true,
      data: {
        id: bot.id,
        name: bot.name,
        welcomeMessage: bot.welcomeMessage,
        fallbackResponse: bot.fallbackResponse,
        offlineResponse: bot.offlineResponse,
        theme: bot.theme,
        widgetConfig: bot.widgetConfig,
        workspace: bot.workspace
      }
    });
  } catch (err) { next(err); }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { botId, sessionId, message, customerInfo } = req.body;

    const bot = await prisma.bot.findFirst({
      where: { OR: [{ id: botId }, { identifier: botId }] },
      include: {
        rules: { include: { conditions: true, actions: true } },
        workflows: { include: { nodes: true, edges: true } },
        workspace: true
      }
    });

    if (!bot) {
      res.status(404).json({ success: false, error: { code: 'BOT_NOT_FOUND', message: 'Bot not found' } });
      return;
    }

    let customer = null;
    if (customerInfo?.email) {
      customer = await prisma.customer.upsert({
        where: { workspaceId_email: { workspaceId: bot.workspaceId, email: customerInfo.email } },
        update: { lastContactAt: new Date(), name: customerInfo.name || undefined, phone: customerInfo.phone || undefined },
        create: {
          workspaceId: bot.workspaceId,
          email: customerInfo.email,
          name: customerInfo.name || 'Website Visitor',
          phone: customerInfo.phone
        }
      });
    }

    let conversation = await prisma.conversation.findUnique({
      where: { sessionId },
      include: { variables: true }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          workspaceId: bot.workspaceId,
          botId: bot.id,
          customerId: customer?.id,
          sessionId,
          status: 'NEW',
          subject: message ? `Chat: ${message.slice(0, 30)}...` : 'New Widget Session'
        },
        include: { variables: true }
      });
    }

    if (message) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'CUSTOMER',
          content: message
        }
      });
    }

    const contextVars: Record<string, string> = {};
    for (const v of conversation.variables) {
      contextVars[v.key] = v.value;
    }

    const lowerMessage = (message || '').toLowerCase();
    const isHandoffRequested = bot.humanHandoffEnabled && bot.handoffKeywords.some((kw: string) => lowerMessage.includes(kw.toLowerCase()));

    if (isHandoffRequested) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: 'ESCALATED' }
      });

      const responseText = 'I am connecting you with a live support representative right away. An agent will join this conversation shortly!';
      const botMsg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'BOT',
          content: responseText
        }
      });

      res.json({
        success: true,
        data: {
          conversationId: conversation.id,
          status: 'ESCALATED',
          message: botMsg
        }
      });
      return;
    }

    if (conversation.activeWorkflowId) {
      const activeWf = bot.workflows.find((w: any) => w.id === conversation.activeWorkflowId);
      if (activeWf) {
        const wfResult = executeWorkflowStep(
          {
            id: activeWf.id,
            name: activeWf.name,
            nodes: activeWf.nodes as any,
            edges: activeWf.edges as any
          },
          conversation.currentWorkflowNodeId,
          message,
          contextVars
        );

        for (const [key, val] of Object.entries(contextVars)) {
          await prisma.conversationVariable.upsert({
            where: { conversationId_key: { conversationId: conversation.id, key } },
            update: { value: val },
            create: { conversationId: conversation.id, key, value: val }
          });
        }

        let botResponse = wfResult.nextMessage || 'Processing workflow step...';

        if (wfResult.nodeType === 'SEARCH_DATABASE') {
          const orderNum = contextVars['orderNumber'];
          if (orderNum) {
            const order = await prisma.order.findFirst({
              where: { workspaceId: bot.workspaceId, orderNumber: { contains: orderNum, mode: 'insensitive' } }
            });

            if (order) {
              botResponse = `📦 **Order ${order.orderNumber} Details:**\n- **Status:** ${order.status}\n- **Delivery Status:** ${order.deliveryStatus || 'In Processing'}\n- **Carrier:** ${order.carrier || 'N/A'} ${order.trackingNumber ? `(${order.trackingNumber})` : ''}\n- **Total:** $${order.totalAmount.toFixed(2)}`;
            } else {
              botResponse = `We couldn't find an active order matching **"${orderNum}"**. Please double check the number and try again.`;
            }
          }
        }

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            currentWorkflowNodeId: wfResult.currentNodeId,
            status: wfResult.isCompleted ? 'RESOLVED' : 'OPEN',
            activeWorkflowId: wfResult.isCompleted ? null : conversation.activeWorkflowId
          }
        });

        const botMsg = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderType: 'BOT',
            content: botResponse,
            quickReplies: wfResult.quickReplies ? (wfResult.quickReplies as any) : undefined
          }
        });

        res.json({
          success: true,
          data: {
            conversationId: conversation.id,
            status: conversation.status,
            message: botMsg
          }
        });
        return;
      }
    }

    const orderMatch = (message || '').match(/ORD-\d{4,6}/i);
    if (orderMatch) {
      const orderNum = orderMatch[0].toUpperCase();
      const order = await prisma.order.findFirst({
        where: { workspaceId: bot.workspaceId, orderNumber: orderNum }
      });

      let responseContent = '';
      if (order) {
        responseContent = `📦 **Order ${order.orderNumber} Status:** ${order.status}\n- **Carrier:** ${order.carrier || 'Standard Carrier'}\n- **Tracking:** ${order.trackingNumber || 'Pending'}\n- **Delivery Status:** ${order.deliveryStatus || 'In Progress'}\n- **Total:** $${order.totalAmount.toFixed(2)}`;
      } else {
        responseContent = `I searched our records for **${orderNum}**, but no matching order was found. Please check the order number and try again.`;
      }

      const botMsg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'BOT',
          content: responseContent
        }
      });

      res.json({ success: true, data: { conversationId: conversation.id, message: botMsg } });
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

    const ruleResult = matchRules(message || '', rules, contextVars);

    if (ruleResult.matched) {
      let finalResponse = ruleResult.response || '';

      if (ruleResult.actions) {
        for (const act of ruleResult.actions) {
          if (act.actionType === 'FETCH_COLLECTION' && act.targetKey) {
            const records = await prisma.customRecord.findMany({
              where: { collection: { slug: act.targetKey, workspaceId: bot.workspaceId } }
            });

            if (records.length > 0) {
              const formattedList = records
                .map((r: any) => `- **${r.data.city || r.data.name || 'Branch'}**: ${r.data.address || ''} (${r.data.phone || ''})`)
                .join('\n');
              finalResponse += `\n\n📍 **Available Locations:**\n${formattedList}`;
            }
          }
        }
      }

      const botMsg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'BOT',
          content: finalResponse,
          quickReplies: ruleResult.quickReplies as any
        }
      });

      res.json({ success: true, data: { conversationId: conversation.id, message: botMsg } });
      return;
    }

    const faqs = await prisma.fAQ.findMany({
      where: { workspaceId: bot.workspaceId, isPublished: true },
      include: { category: true, tags: true }
    });

    const searchItems = faqs.map((f: any) => ({
      id: f.id,
      type: 'FAQ' as const,
      title: f.question,
      content: f.answer,
      category: f.category?.name,
      tags: f.tags.map((t: any) => t.name)
    }));

    const searchResult = rankSearchResults(message || '', searchItems);

    if (searchResult.hasMatch && searchResult.bestMatch) {
      const best = searchResult.bestMatch;
      const botMsg = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'BOT',
          content: `${best.content}`
        }
      });

      res.json({ success: true, data: { conversationId: conversation.id, message: botMsg } });
      return;
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { isUnresolvedQuestion: true, unresolvedText: message }
    });

    const botMsg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: 'BOT',
        content: bot.fallbackResponse,
        quickReplies: [
          { label: 'Browse FAQs', payload: 'faqs' },
          { label: 'Talk to Support Agent', payload: 'agent' }
        ]
      }
    });

    res.json({ success: true, data: { conversationId: conversation.id, message: botMsg } });
  } catch (err) { next(err); }
});

export default router;
