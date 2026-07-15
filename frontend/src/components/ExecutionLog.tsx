// Execution log viewer -- 2026-07-15 16:26:57
import { useEffect, useRef, useState } from 'react';

interface LogEntry { nodeId: string; level: string; message: string; timestamp: string; data?: unknown; }
interface Props { executionId: string | null; wsUrl?: string; }

const levelColors: Record<string, string> = {
  info: 'text-blue-400',
  error: 'text-red-400',
  warn: 'text-yellow-400',
};

export default function ExecutionLog({ executionId, wsUrl = 'ws://localhost:5000' }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!executionId) return;
    setLogs([]);
    const ws = new WebSocket(wsUrl + '/ws');
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const log: LogEntry = JSON.parse(e.data);
        if (log.executionId === executionId) setLogs(prev => [...prev, log]);
      } catch {}
    };
    return () => ws.close();
  }, [executionId, wsUrl]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className='h-64 bg-gray-950 border-t border-gray-800 font-mono text-xs overflow-y-auto p-3'>
      <div className='flex items-center gap-2 mb-2'>
        <div className={w-2 h-2 rounded-full } />
        <span className='text-gray-500'>{connected ? 'Live' : 'Disconnected'} -- {executionId ?? 'No execution selected'}</span>
      </div>
      {logs.map((log, i) => (
        <div key={i} className='flex gap-2 mb-0.5'>
          <span className='text-gray-600'>{new Date(log.timestamp).toLocaleTimeString()}</span>
          <span className='text-gray-500'>[{log.nodeId}]</span>
          <span className={levelColors[log.level] ?? 'text-gray-300'}>{log.message}</span>
        </div>
      ))}
      {logs.length === 0 && <p className='text-gray-600'>No logs yet.</p>}
      <div ref={bottomRef} />
    </div>
  );
}