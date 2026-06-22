import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { executionEngine } from '../services/executionEngine.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/workflows -- list all workflows
router.get('/', async (_req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { executions: true } } },
    });
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// GET /api/workflows/:id -- get single workflow with nodes
router.get('/:id', async (req, res) => {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id },
      include: { executions: { take: 10, orderBy: { startedAt: 'desc' } } },
    });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// POST /api/workflows -- create workflow
router.post('/', async (req, res) => {
  try {
    const { name, description, nodes, edges } = req.body;
    const workflow = await prisma.workflow.create({
      data: { name, description: description || '', nodes: JSON.stringify(nodes || []), edges: JSON.stringify(edges || []) },
    });
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create workflow' });
  }
});

// PATCH /api/workflows/:id -- update workflow
router.patch('/:id', async (req, res) => {
  try {
    const { name, description, nodes, edges, enabled } = req.body;
    const workflow = await prisma.workflow.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(nodes && { nodes: JSON.stringify(nodes) }),
        ...(edges && { edges: JSON.stringify(edges) }),
        ...(enabled !== undefined && { enabled }),
      },
    });
    res.json(workflow);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update workflow' });
  }
});

// POST /api/workflows/:id/trigger -- manually trigger a workflow
router.post('/:id/trigger', async (req, res) => {
  try {
    const workflow = await prisma.workflow.findUnique({ where: { id: req.params.id } });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    const execution = await executionEngine.run(workflow, req.body || {});
    res.status(202).json({ executionId: execution.id, status: 'started' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger workflow' });
  }
});

// DELETE /api/workflows/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.workflow.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

export default router;