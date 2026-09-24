export type SenderType = 'CUSTOMER' | 'BOT' | 'AGENT' | 'SYSTEM';

export type ConversationStatus = 'NEW' | 'OPEN' | 'WAITING' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export type MatchType = 'EXACT_PHRASE' | 'EXACT_KEYWORD' | 'PARTIAL_KEYWORD' | 'MULTIPLE_KEYWORDS' | 'INTENT_CATEGORY';

export type WorkflowNodeType =
  | 'MESSAGE'
  | 'QUESTION'
  | 'MULTIPLE_CHOICE'
  | 'COLLECT_TEXT'
  | 'COLLECT_EMAIL'
  | 'COLLECT_PHONE'
  | 'COLLECT_ORDER_ID'
  | 'SEARCH_DATABASE'
  | 'SEARCH_FAQ'
  | 'CONDITIONAL_BRANCH'
  | 'DELAY'
  | 'ASSIGN_AGENT'
  | 'CREATE_TICKET'
  | 'UPDATE_CUSTOMER'
  | 'END';

export interface QuickReplyOption {
  label: string;
  payload: string;
  action?: string;
}

export interface RuleMatchResult {
  matched: boolean;
  ruleId?: string;
  ruleName?: string;
  score: number;
  matchType?: MatchType;
  matchedTrigger?: string;
  response?: string;
  quickReplies?: QuickReplyOption[];
  actions?: Array<{
    actionType: string;
    targetKey?: string;
    value?: string;
  }>;
}

export interface SearchResultItem {
  id: string;
  type: 'FAQ' | 'ARTICLE' | 'PRODUCT' | 'SERVICE' | 'COLLECTION' | 'ORDER';
  title: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  items: SearchResultItem[];
  bestMatch?: SearchResultItem;
  hasMatch: boolean;
}

export interface WorkflowState {
  workflowId: string;
  currentNodeId: string;
  variables: Record<string, string>;
  isCompleted: boolean;
  history: string[];
}

export interface WorkflowExecutionResult {
  nextMessage?: string;
  quickReplies?: QuickReplyOption[];
  currentNodeId: string;
  nodeType: WorkflowNodeType;
  requiresInput: boolean;
  inputVariable?: string;
  isCompleted: boolean;
  retrievedData?: any;
}
