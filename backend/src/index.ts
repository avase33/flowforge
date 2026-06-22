import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import workflowRouter from './routes/workflows.js';
import executionRouter from './routes/executions.js';
import webhookRouter from './routes/webhooks.js';
import { executionEngine } from './services/executionEngine.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', workflowRouter);
app.use('/api/executions', executionRouter);
app.use('/api/webhooks', webhookRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket: stream live execution logs to connected clients
wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  executionEngine.on('log', (log) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(log));
    }
  });
  ws.on('close', () => console.log('[WS] Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('FlowForge API running on port', PORT);
});