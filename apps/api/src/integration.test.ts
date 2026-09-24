import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from './db.js';
import { matchRules } from '@chatbots-ai/shared';

describe('Integration Tests — Non-AI Engine & PostgreSQL Retrieval', () => {
  beforeAll(async () => {
    // Verify database connection
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retrieves order status from PostgreSQL database for order ORD-10025', async () => {
    const order = await prisma.order.findFirst({
      where: { orderNumber: 'ORD-10025' }
    });

    expect(order).not.toBeNull();
    expect(order?.orderNumber).toBe('ORD-10025');
    expect(order?.status).toBe('In Transit');
  });

  it('executes rule engine matching for location query without AI models', async () => {
    const rules = await prisma.botRule.findMany({
      where: { bot: { identifier: 'acme-main-bot' } }
    });

    const formattedRules = rules.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      matchType: r.matchType as any,
      triggers: r.triggers,
      priority: r.priority,
      isActive: r.isActive,
      response: r.response
    }));

    const match = matchRules('where is your office location', formattedRules);

    expect(match.matched).toBe(true);
    expect(match.ruleName).toBe('Location & Address Rule');
    expect(match.response).toContain('100 Innovation Way');
  });
});
