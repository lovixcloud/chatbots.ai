import { describe, it, expect } from 'vitest';
import { matchRules, RuleDefinition, normalizeInput } from './rules.js';
import { rankSearchResults, SearchableItem } from './ranking.js';
import { executeWorkflowStep, WorkflowDefinition } from './workflow.js';

describe('Rule Engine', () => {
  const sampleRules: RuleDefinition[] = [
    {
      id: 'rule-1',
      name: 'Location Rule',
      category: 'location',
      matchType: 'PARTIAL_KEYWORD',
      triggers: ['location', 'address', 'where are you'],
      priority: 10,
      isActive: true,
      response: 'Our address is 100 Innovation Way, San Francisco, CA.'
    },
    {
      id: 'rule-2',
      name: 'Exact Order Status',
      category: 'orders',
      matchType: 'EXACT_PHRASE',
      triggers: ['where is my order'],
      priority: 20,
      isActive: true,
      response: 'Please enter your order number.'
    }
  ];

  it('normalizes text input correctly', () => {
    expect(normalizeInput('  WHERE is my ORDER?!  ')).toBe('where is my order');
  });

  it('matches exact phrase rule with higher score', () => {
    const result = matchRules('where is my order', sampleRules);
    expect(result.matched).toBe(true);
    expect(result.ruleId).toBe('rule-2');
    expect(result.score).toBeGreaterThan(100);
  });

  it('matches partial keyword trigger correctly', () => {
    const result = matchRules('what is your office location', sampleRules);
    expect(result.matched).toBe(true);
    expect(result.ruleId).toBe('rule-1');
  });
});

describe('Search Ranking Engine', () => {
  const items: SearchableItem[] = [
    {
      id: 'faq-1',
      type: 'FAQ',
      title: 'What is your return policy?',
      content: 'We offer a 30-day money back guarantee on unopened products.',
      category: 'Returns',
      tags: ['refund', 'return']
    },
    {
      id: 'faq-2',
      type: 'FAQ',
      title: 'How long does shipping take?',
      content: 'Standard shipping takes 3-5 business days across US.',
      category: 'Shipping'
    }
  ];

  it('ranks FAQs accurately based on exact title and content keyword match', () => {
    const result = rankSearchResults('return policy', items);
    expect(result.hasMatch).toBe(true);
    expect(result.bestMatch?.id).toBe('faq-1');
  });
});

describe('Workflow Engine', () => {
  const workflow: WorkflowDefinition = {
    id: 'wf-1',
    name: 'Order Status Flow',
    nodes: [
      {
        id: 'node-1',
        nodeType: 'MESSAGE',
        label: 'Welcome',
        content: 'Welcome to order tracking.'
      },
      {
        id: 'node-2',
        nodeType: 'COLLECT_ORDER_ID',
        label: 'Ask Order Number',
        content: 'Please enter your order number:',
        variableName: 'orderNumber'
      },
      {
        id: 'node-3',
        nodeType: 'END',
        label: 'Done',
        content: 'Thank you!'
      }
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
      { id: 'e2', sourceNodeId: 'node-2', targetNodeId: 'node-3' }
    ]
  };

  it('advances through workflow step by step capturing context variables', () => {
    const vars: Record<string, string> = {};
    const step1 = executeWorkflowStep(workflow, null, null, vars);
    expect(step1.currentNodeId).toBe('node-1');

    const step2 = executeWorkflowStep(workflow, 'node-2', 'ORD-10025', vars);
    expect(vars['orderNumber']).toBe('ORD-10025');
  });
});
