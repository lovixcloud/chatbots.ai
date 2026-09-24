# Database Documentation

The database is built on PostgreSQL using Prisma ORM.

## Primary Models
* **Workspace**: Multi-tenant container for all customer support assets.
* **User & WorkspaceMember**: Role-based access control (Owner, Administrator, Agent).
* **Bot & BotTheme**: Chatbot configuration, welcome messages, and visual theme settings.
* **BotRule & RuleAction**: Deterministic trigger rules and attached database fetch actions.
* **Workflow & WorkflowNode**: Decision tree nodes (`MESSAGE`, `COLLECT_ORDER_ID`, `SEARCH_DATABASE`).
* **Order & Product**: Business data store queryable by the chatbot engine.
* **CustomCollection & CustomRecord**: Administrator-defined structured datasets (e.g., Branch Offices, Courses).
* **Conversation & Message**: Persistent customer interaction logs.
