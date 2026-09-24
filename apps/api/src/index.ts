import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';
import botRoutes from './routes/bots.js';
import faqRoutes from './routes/faqs.js';
import articleRoutes from './routes/articles.js';
import businessDataRoutes from './routes/businessData.js';
import ruleRoutes from './routes/rules.js';
import workflowRoutes from './routes/workflows.js';
import conversationRoutes from './routes/conversations.js';
import analyticsRoutes from './routes/analytics.js';
import auditRoutes from './routes/audit.js';
import widgetRoutes from './routes/widget.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/data', businessDataRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/widget', widgetRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chatbots-ai-api', timestamp: new Date() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

interface ExtendedWebSocket extends WebSocket {
  conversationId?: string;
  isAgent?: boolean;
}

const clients = new Set<ExtendedWebSocket>();

wss.on('connection', (ws: ExtendedWebSocket) => {
  clients.add(ws);

  ws.on('message', (messageRaw: string) => {
    try {
      const data = JSON.parse(messageRaw.toString());

      if (data.type === 'JOIN_CONVERSATION') {
        ws.conversationId = data.conversationId;
        ws.isAgent = Boolean(data.isAgent);
      } else if (data.type === 'CHAT_MESSAGE' || data.type === 'TYPING') {
        for (const client of clients) {
          if (client !== ws && client.conversationId === ws.conversationId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        }
      }
    } catch (e) {
      console.error('WS error parsing message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 chatbots.ai API running on http://localhost:${PORT}`);
});
