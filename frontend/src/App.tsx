import { useState, useEffect } from 'react';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowList from './components/WorkflowList';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
  _count?: { executions: number };
}

export default function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/workflows')
      .then(r => r.json())
      .then(data => { setWorkflows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const createWorkflow = async () => {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Workflow', description: 'Untitled automation' }),
    });
    const wf = await res.json();
    setWorkflows(prev => [wf, ...prev]);
    setSelected(wf);
  };

  return (
    <div className='flex h-screen bg-gray-950 text-white'>
      {/* Sidebar */}
      <div className='w-72 border-r border-gray-800 flex flex-col'>
        <div className='p-4 border-b border-gray-800 flex items-center justify-between'>
          <h1 className='text-lg font-bold'>FlowForge</h1>
          <button onClick={createWorkflow} className='px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium'>
            + New
          </button>
        </div>
        {loading ? (
          <div className='p-4 text-gray-400 text-sm'>Loading...</div>
        ) : (
          <WorkflowList workflows={workflows} selected={selected} onSelect={setSelected} />
        )}
      </div>
      {/* Canvas */}
      <div className='flex-1'>
        {selected ? (
          <WorkflowCanvas workflow={selected} />
        ) : (
          <div className='h-full flex items-center justify-center text-gray-500'>
            <div className='text-center'>
              <div className='text-5xl mb-4'>+</div>
              <p className='text-lg'>Select a workflow or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}