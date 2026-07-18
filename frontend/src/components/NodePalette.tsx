// Node palette sidebar -- 2026-07-17 21:39:01

interface NodeType {
  type: string;
  label: string;
  category: string;
  color: string;
  description: string;
}

const NODE_TYPES: NodeType[] = [
  { type: 'webhook', label: 'Webhook', category: 'Triggers', color: 'bg-green-700', description: 'Trigger on incoming HTTP' },
  { type: 'cron', label: 'Cron', category: 'Triggers', color: 'bg-green-700', description: 'Run on a schedule' },
  { type: 'http-request', label: 'HTTP Request', category: 'Actions', color: 'bg-blue-700', description: 'Call any REST API' },
  { type: 'delay', label: 'Delay', category: 'Logic', color: 'bg-yellow-700', description: 'Wait N milliseconds' },
  { type: 'transform', label: 'Transform', category: 'Logic', color: 'bg-purple-700', description: 'Run JavaScript code' },
  { type: 'filter', label: 'Filter', category: 'Logic', color: 'bg-orange-700', description: 'Conditionally continue' },
  { type: 'log', label: 'Log', category: 'Utilities', color: 'bg-gray-600', description: 'Log output to execution history' },
];

interface Props { onAddNode: (type: string) => void; }

export default function NodePalette({ onAddNode }: Props) {
  const categories = [...new Set(NODE_TYPES.map(n => n.category))];

  return (
    <div className='w-56 border-r border-gray-800 overflow-y-auto p-3'>
      <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>Nodes</h3>
      {categories.map(cat => (
        <div key={cat} className='mb-4'>
          <p className='text-xs text-gray-500 mb-2'>{cat}</p>
          {NODE_TYPES.filter(n => n.category === cat).map(node => (
            <div key={node.type} onClick={() => onAddNode(node.type)}
              className='flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-800 mb-1'>
              <div className={w-2 h-2 rounded-full } />
              <div>
                <p className='text-xs font-medium text-white'>{node.label}</p>
                <p className='text-xs text-gray-500'>{node.description}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}