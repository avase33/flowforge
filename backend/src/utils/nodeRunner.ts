// Node runner utilities -- 2026-07-17 21:21:30

export interface NodeResult {
  nodeId: string;
  output: unknown;
  durationMs: number;
  error?: string;
}

export async function runHttpNode(config: { url: string; method?: string; headers?: Record<string,string>; body?: unknown }): Promise<unknown> {
  const { url, method = 'GET', headers = {}, body } = config;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + response.statusText);
  const ct = response.headers.get('content-type') ?? '';
  return ct.includes('json') ? response.json() : response.text();
}

export async function runDelayNode(config: { ms: number }): Promise<{ delayed: boolean; ms: number }> {
  await new Promise(r => setTimeout(r, config.ms ?? 1000));
  return { delayed: true, ms: config.ms };
}

export function runTransformNode(config: { code: string }, context: Record<string, unknown>): unknown {
  const fn = new Function('context', 'return (' + config.code + ')(context);');
  return fn(context);
}

export function runFilterNode(config: { condition: string }, context: Record<string, unknown>): boolean {
  const fn = new Function('context', 'return !!(' + config.condition + ');');
  return fn(context);
}

export async function runNode(type: string, config: Record<string, unknown>, context: Record<string, unknown>): Promise<unknown> {
  const start = Date.now();
  switch (type) {
    case 'http-request': return runHttpNode(config as any);
    case 'delay': return runDelayNode(config as any);
    case 'transform': return runTransformNode(config as any, context);
    case 'filter': return runFilterNode(config as any, context);
    default: return { skipped: true, type };
  }
}