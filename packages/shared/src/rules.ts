import { MatchType, QuickReplyOption, RuleMatchResult } from './types.js';

export interface RuleDefinition {
  id: string;
  name: string;
  category?: string | null;
  matchType: MatchType;
  triggers: string[];
  priority: number;
  isActive: boolean;
  response: string;
  quickReplies?: any;
  conditions?: Array<{
    field: string;
    operator: string;
    value?: string | null;
  }>;
  actions?: Array<{
    actionType: string;
    targetKey?: string | null;
    value?: string | null;
  }>;
}

export function normalizeInput(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars except spaces/dashes
    .replace(/\s+/g, ' ');
}

export function evaluateRuleCondition(
  condition: { field: string; operator: string; value?: string | null },
  contextVariables: Record<string, string>
): boolean {
  const varValue = contextVariables[condition.field] || '';

  switch (condition.operator) {
    case 'EQUALS':
      return varValue.toLowerCase() === (condition.value || '').toLowerCase();
    case 'CONTAINS':
      return varValue.toLowerCase().includes((condition.value || '').toLowerCase());
    case 'EXISTS':
    case 'NOT_EMPTY':
      return Boolean(varValue && varValue.trim().length > 0);
    default:
      return true;
  }
}

export function matchRules(
  userQuery: string,
  rules: RuleDefinition[],
  contextVariables: Record<string, string> = {}
): RuleMatchResult {
  const normalizedQuery = normalizeInput(userQuery);
  const wordsInQuery = new Set(normalizedQuery.split(' ').filter(Boolean));

  let bestResult: RuleMatchResult = {
    matched: false,
    score: 0
  };

  const activeRules = rules.filter((r) => r.isActive);

  for (const rule of activeRules) {
    // Verify rule conditions if any
    if (rule.conditions && rule.conditions.length > 0) {
      const allConditionsMet = rule.conditions.every((cond) =>
        evaluateRuleCondition(cond, contextVariables)
      );
      if (!allConditionsMet) {
        continue;
      }
    }

    for (const rawTrigger of rule.triggers) {
      const trigger = normalizeInput(rawTrigger);
      let matchScore = 0;
      let isMatch = false;

      switch (rule.matchType) {
        case 'EXACT_PHRASE': {
          if (normalizedQuery === trigger) {
            isMatch = true;
            matchScore = 100 + rule.priority;
          }
          break;
        }
        case 'EXACT_KEYWORD': {
          if (wordsInQuery.has(trigger) || normalizedQuery === trigger) {
            isMatch = true;
            matchScore = 80 + rule.priority;
          }
          break;
        }
        case 'PARTIAL_KEYWORD': {
          if (normalizedQuery.includes(trigger) || trigger.includes(normalizedQuery)) {
            isMatch = true;
            matchScore = 70 + rule.priority;
          }
          break;
        }
        case 'MULTIPLE_KEYWORDS': {
          const triggerKeywords = trigger.split(' ').filter(Boolean);
          const matchedCount = triggerKeywords.filter((kw) => normalizedQuery.includes(kw)).length;
          if (matchedCount > 0) {
            isMatch = matchedCount === triggerKeywords.length;
            matchScore = Math.floor((matchedCount / triggerKeywords.length) * 75) + rule.priority;
          }
          break;
        }
        case 'INTENT_CATEGORY': {
          if (normalizedQuery.includes(trigger) || (rule.category && normalizedQuery.includes(normalizeInput(rule.category)))) {
            isMatch = true;
            matchScore = 65 + rule.priority;
          }
          break;
        }
      }

      if (isMatch && matchScore > bestResult.score) {
        let parsedQuickReplies: QuickReplyOption[] | undefined;
        if (rule.quickReplies) {
          if (typeof rule.quickReplies === 'string') {
            try {
              parsedQuickReplies = JSON.parse(rule.quickReplies);
            } catch {
              parsedQuickReplies = undefined;
            }
          } else if (Array.isArray(rule.quickReplies)) {
            parsedQuickReplies = rule.quickReplies;
          }
        }

        bestResult = {
          matched: true,
          ruleId: rule.id,
          ruleName: rule.name,
          score: matchScore,
          matchType: rule.matchType,
          matchedTrigger: rawTrigger,
          response: rule.response,
          quickReplies: parsedQuickReplies,
          actions: rule.actions
            ? rule.actions.map((a) => ({
                actionType: a.actionType,
                targetKey: a.targetKey || undefined,
                value: a.value || undefined
              }))
            : undefined
        };
      }
    }
  }

  return bestResult;
}
