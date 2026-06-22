import { useState } from 'react';
import type { Workflow } from '../App';

interface Props {
  workflow: Workflow;
}

export default function WorkflowCanvas({ workflow }: Props) {
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const triggerWorkflow = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/workflows/' + workflow.id + '/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manual: true, triggeredAt: new Date().toISOString() }),
      });
      const data = await res.json();
      setLastRun(data.executionId);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className='h-full flex flex-col'>
      {/* Toolbar */}
      <div className='h-14 border-b border-gray-800 flex items-center px-4 gap-3'>
        <h2 className='font-semibold flex-1'>{workflow.name}</h2>
        <button
          onClick={triggerWorkflow}
          disabled={running}
          className='px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium'>
          {running ? 'Running...' : 'Run Now'}
        </button>
      </div>
      {/* Canvas area */}
      <div className='flex-1 relative bg-gray-950'>
        {/* Grid background */}
        <svg className='absolute inset-0 w-full h-full opacity-10'>
          <defs>
            <pattern id='grid' width='24' height='24' patternUnits='userSpaceOnUse'>
              <path d='M 24 0 L 0 0 0 24' fill='none' stroke='white' strokeWidth='0.5'/>
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)'/>
        </svg>
        {/* Placeholder nodes */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center'>
          <div className='bg-green-900 border border-green-600 rounded-lg px-4 py-3 text-sm'>
            <div className='text-green-300 font-medium'>Webhook Trigger</div>
            <div className='text-green-500 text-xs mt-1'>POST /webhooks/{workflow.id}</div>
          </div>
          <div className='text-gray-600 text-2xl'>-</div>
          <div className='bg-blue-900 border border-blue-600 rounded-lg px-4 py-3 text-sm'>
            <div className='text-blue-300 font-medium'>HTTP Request</div>
            <div className='text-blue-500 text-xs mt-1'>GET https://api.example.com</div>
          </div>
          <div className='text-gray-600 text-2xl'>-</div>
          <div className='bg-purple-900 border border-purple-600 rounded-lg px-4 py-3 text-sm'>
            <div className='text-purple-300 font-medium'>Transform</div>
            <div className='text-purple-500 text-xs mt-1'>JavaScript eval</div>
          </div>
        </div>
        {lastRun && (
          <div className='absolute bottom-4 right-4 bg-green-900 border border-green-600 rounded px-3 py-2 text-sm text-green-300'>
            Execution started: {lastRun.slice(0, 8)}...
          </div>
        )}
      </div>
    </div>
  );
}