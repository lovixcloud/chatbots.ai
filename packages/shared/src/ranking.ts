import { SearchResult, SearchResultItem } from './types.js';
import { normalizeInput } from './rules.js';

export interface SearchableItem {
  id: string;
  type: 'FAQ' | 'ARTICLE' | 'PRODUCT' | 'SERVICE' | 'COLLECTION' | 'ORDER';
  title: string;
  content: string;
  category?: string | null;
  tags?: string[];
  priority?: number;
  metadata?: Record<string, any>;
}

export function rankSearchResults(
  query: string,
  items: SearchableItem[],
  minScoreThreshold = 25
): SearchResult {
  const normalizedQuery = normalizeInput(query);
  const queryTokens = new Set(normalizedQuery.split(' ').filter((t) => t.length > 2));

  if (queryTokens.size === 0 && normalizedQuery.length === 0) {
    return { items: [], hasMatch: false };
  }

  const scoredItems: SearchResultItem[] = [];

  for (const item of items) {
    const normTitle = normalizeInput(item.title);
    const normContent = normalizeInput(item.content);
    const normCategory = item.category ? normalizeInput(item.category) : '';
    const normTags = (item.tags || []).map(normalizeInput);

    let score = 0;

    // 1. Exact title or content phrase match
    if (normTitle === normalizedQuery) {
      score += 100;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 75;
    }

    if (normContent.includes(normalizedQuery)) {
      score += 50;
    }

    // 2. Query token matching
    for (const token of queryTokens) {
      if (normTitle.includes(token)) {
        score += 30;
      }
      if (normCategory && normCategory.includes(token)) {
        score += 25;
      }
      if (normTags.some((tag) => tag.includes(token))) {
        score += 20;
      }
      if (normContent.includes(token)) {
        score += 10;
      }
    }

    // 3. Priority boost
    if (item.priority) {
      score += Math.min(item.priority, 15);
    }

    if (score >= minScoreThreshold) {
      scoredItems.push({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        score,
        metadata: item.metadata
      });
    }
  }

  scoredItems.sort((a, b) => b.score - a.score);

  return {
    items: scoredItems,
    bestMatch: scoredItems.length > 0 ? scoredItems[0] : undefined,
    hasMatch: scoredItems.length > 0
  };
}
