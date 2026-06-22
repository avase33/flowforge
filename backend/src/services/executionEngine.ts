import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface ExecutionLog {
  executionId: string;
  nodeId: string;
  level: 'info' | 'error' | 'warn';
  message: string;
  timestamp: string;
  data?: unknown;
}

class ExecutionEngine extends EventEmitter {
  async run(workflow: { id: string; nodes: string; edges: string }, input: Record<string, unknown>) {
    const execution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: 'running',
        input: JSON.stringify(input),
        startedAt: new Date(),
      },
    });

    this.log(execution.id, 'trigger', 'info', 'Workflow execution started', input);

    // Execute nodes in topological order
    const nodes: WorkflowNode[] = JSON.parse(workflow.nodes || '[]');
    let context: Record<string, unknown> = { input };

    for (const node of nodes) {
      try {
        this.log(execution.id, node.id, 'info', 'Executing node: ' + node.type);
        const result = await this.executeNode(node, context);
        context[node.id] = result;
        this.log(execution.id, node.id, 'info', 'Node completed', result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.log(execution.id, node.id, 'error', 'Node failed: ' + message);
        await prisma.execution.update({
          where: { id: execution.id },
          data: { status: 'failed', finishedAt: new Date(), error: message },
        });
        return execution;
      }
    }

    await prisma.execution.update({
      where: { id: execution.id },
      data: { status: 'success', finishedAt: new Date(), output: JSON.stringify(context) },
    });

    this.log(execution.id, 'system', 'info', 'Workflow execution completed');
    return execution;
  }

  private async executeNode(node: WorkflowNode, context: Record<string, unknown>): Promise<unknown> {
    switch (node.type) {
      case 'http-request': {
        const { url, method = 'GET', headers = {}, body } = node.data as Record<string, unknown>;
        const res = await fetch(url as string, {
          method: method as string,
          headers: headers as Record<string, string>,
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return res.json();
      }
      case 'transform': {
        const fn = new Function('context', node.data.code as string);
        return fn(context);
      }
      case 'delay': {
        await new Promise(r => setTimeout(r, (node.data.ms as number) || 1000));
        return { delayed: true };
      }
      default:
        return { skipped: true, nodeType: node.type };
    }
  }

  private log(executionId: string, nodeId: string, level: 'info' | 'error' | 'warn', message: string, data?: unknown) {
    const logEntry: ExecutionLog = {
      executionId, nodeId, level, message,
      timestamp: new Date().toISOString(),
      ...(data !== undefined ? { data } : {}),
    };
    this.emit('log', logEntry);
  }
}

export const executionEngine = new ExecutionEngine();