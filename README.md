# chatbots.ai — Customizable Business Customer Support Platform

**chatbots.ai** is a SaaS platform for creating, customizing, deploying, and managing automated customer support chatbots.

> **CRITICAL ARCHITECTURAL GUARANTEE:** chatbots.ai operates 100% deterministically using application-controlled data, rules, workflows, searchable knowledge bases, and PostgreSQL lookups. **Zero third-party generative AI models or inference APIs are integrated.**

---

## 🌟 Key Features

* **Multi-Tenant Workspace Isolation**: Multi-workspace support isolated by workspace ID with role-based access permissions.
* **Deterministic Rule Engine**: Matches customer queries against exact keywords, phrases, and intent categories.
* **Business Data Retrieval**: Instant database lookups for orders (e.g. `ORD-10025`), hardware products, services, and custom collections (e.g., branch locations, course listings).
* **Decision Tree Workflows**: Interactive multi-step flow execution that captures variables and searches business databases.
* **Fast Search Ranking**: Deterministic scoring across FAQs and knowledge articles without external embedding models.
* **Live Support Agent Handoff**: Real-time WebSockets communication between customers and human agents.
* **Embeddable Chat Widget**: Standalone floating widget snippet customizable per bot.
* **Calculated Analytics**: Metrics derived directly from stored conversation logs and event tables.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v20+
* **pnpm**: v10+
* **PostgreSQL**: Running on `localhost:5432`

### Setup Steps
```bash
# 1. Install dependencies
pnpm install

# 2. Build shared packages
pnpm build:shared

# 3. Push Prisma schema & Seed database
pnpm db:push
pnpm db:seed

# 4. Run application in development mode
pnpm dev
```

The services will start at:
* **Web Dashboard & Marketing Site**: `http://localhost:3000`
* **API Backend**: `http://localhost:4000`
* **Embeddable Widget**: `http://localhost:4001`

---

## 🧪 Testing

```bash
# Run unit tests for rule matching, search ranking, and workflow engines
pnpm test
```

---

## 📚 Documentation
* [Architecture Documentation](docs/architecture.md)
* [Database Schema & Models](docs/database.md)
* [REST API Endpoint Reference](docs/api.md)
* [Rule Engine Specification](docs/rules-engine.md)
* [Workflows & Decision Trees](docs/workflows.md)
* [Embeddable Widget Guide](docs/widget.md)
