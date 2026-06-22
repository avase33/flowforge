import type { Workflow } from '../App';

interface Props {
  workflows: Workflow[];
  selected: Workflow | null;
  onSelect: (wf: Workflow) => void;
}

export default function WorkflowList({ workflows, selected, onSelect }: Props) {
  if (workflows.length === 0) {
    return <div className='p-4 text-gray-500 text-sm'>No workflows yet. Create one to get started.</div>;
  }
  return (
    <div className='overflow-y-auto flex-1'>
      {workflows.map(wf => (
        <div
          key={wf.id}
          onClick={() => onSelect(wf)}
          className={'p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors ' + (selected?.id === wf.id ? 'bg-gray-900 border-l-2 border-l-indigo-500' : '')}
        >
          <div className='flex items-center justify-between mb-1'>
            <span className='font-medium text-sm'>{wf.name}</span>
            <span className={'text-xs px-2 py-0.5 rounded-full ' + (wf.enabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400')}>
              {wf.enabled ? 'Active' : 'Off'}
            </span>
          </div>
          <p className='text-gray-400 text-xs truncate'>{wf.description}</p>
          {wf._count && (
            <p className='text-gray-600 text-xs mt-1'>{wf._count.executions} runs</p>
          )}
        </div>
      ))}
    </div>
  );
}