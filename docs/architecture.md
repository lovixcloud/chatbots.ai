# System Architecture — chatbots.ai

## Overview
chatbots.ai is structured as a TypeScript monorepo using pnpm workspaces:

```text
chatbots-ai/
├── apps/
│   ├── web/        # React + Vite + Tailwind SaaS Dashboard & Landing Page
│   ├── api/        # Node.js + Express + WebSockets REST API
│   └── widget/     # Standalone Embeddable Customer Chat Widget
├── packages/
│   └── shared/     # Rule Engine, Search Ranking, and Workflow State Engines
└── prisma/         # PostgreSQL Schema & Seeding Script
```

## Non-AI Deterministic Response Flow
1. **User Message Received** via REST API or WebSocket.
2. **Input Normalization**: Removes non-word characters and standardizes whitespace.
3. **Keyword & Regex Trigger Search**: Checks configured trigger rules (Exact Phrase -> Keyword -> Intent).
4. **Active Workflow Check**: If session is inside an active workflow, advances to the next decision node.
5. **Database Search**: Checks PostgreSQL orders, products, and custom collections.
6. **Knowledge Base Search**: Scores published FAQs by keyword frequency and title relevance.
7. **Fallback**: If score < threshold, returns configured fallback message and records unresolved query.
