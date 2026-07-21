// Execution routes -- 2026-07-21 17:25:13
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { workflowId, status, limit = '20' } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (workflowId) where.workflowId = workflowId;
    if (status) where.status = status;
    const executions = await prisma.execution.findMany({
      where, orderBy: { startedAt: 'desc' }, take: parseInt(limit),
      include: { workflow: { select: { name: true } } },
    });
    res.json({ executions, count: executions.length });
  } catch { res.status(500).json({ error: 'Failed to fetch executions' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const execution = await prisma.execution.findUnique({ where: { id: req.params.id }, include: { workflow: true } });
    if (!execution) return res.status(404).json({ error: 'Execution not found' });
    res.json(execution);
  } catch { res.status(500).json({ error: 'Failed to fetch execution' }); }
});

router.post('/:id/retry', async (req, res) => {
  try {
    const execution = await prisma.execution.findUnique({ where: { id: req.params.id } });
    if (!execution) return res.status(404).json({ error: 'Execution not found' });
    if (execution.status !== 'failed') return res.status(400).json({ error: 'Can only retry failed executions' });
    const retried = await prisma.execution.create({
      data: { workflowId: execution.workflowId, status: 'pending', input: execution.input, startedAt: new Date() },
    });
    res.status(202).json({ executionId: retried.id, status: 'pending' });
  } catch { res.status(500).json({ error: 'Failed to retry execution' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.execution.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Failed to delete execution' }); }
});

export default router;