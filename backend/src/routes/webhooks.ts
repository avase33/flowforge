// Webhook routes -- 2026-07-14 14:30:49
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { executionEngine } from '../services/executionEngine';

const router = Router();
const prisma = new PrismaClient();

// POST /api/webhooks/:token -- receive webhook trigger
router.post('/:token', async (req, res) => {
  try {
    const endpoint = await prisma.webhookEndpoint.findUnique({ where: { token: req.params.token } });
    if (!endpoint) return res.status(404).json({ error: 'Webhook not found' });
    const workflow = await prisma.workflow.findUnique({ where: { id: endpoint.workflowId } });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    if (!workflow.enabled) return res.status(200).json({ message: 'Workflow disabled' });
    const execution = await executionEngine.run(workflow, { source: 'webhook', headers: req.headers, body: req.body });
    res.status(202).json({ executionId: execution.id, status: 'started' });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// GET /api/webhooks -- list all endpoints
router.get('/', async (_req, res) => {
  const endpoints = await prisma.webhookEndpoint.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ endpoints, count: endpoints.length });
});

// POST /api/webhooks -- create endpoint for a workflow
router.post('/', async (req, res) => {
  try {
    const { workflowId } = req.body;
    const existing = await prisma.webhookEndpoint.findFirst({ where: { workflowId } });
    if (existing) return res.json(existing);
    const endpoint = await prisma.webhookEndpoint.create({ data: { workflowId } });
    res.status(201).json({ endpoint, url: '/api/webhooks/' + endpoint.token });
  } catch { res.status(400).json({ error: 'Failed to create webhook' }); }
});

export default router;