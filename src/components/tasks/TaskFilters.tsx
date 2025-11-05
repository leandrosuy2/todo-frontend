import type { TaskStatus } from '../../types';
import type { ReactElement } from 'react';
import { Button } from '../shared';

interface TaskFiltersProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

export function TaskFilters({ status, onChange }: TaskFiltersProps) {
  const filters: { value: TaskStatus; label: string; icon: ReactElement }[] = [
    { 
      value: 'all', 
      label: 'Todas',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      value: 'pending', 
      label: 'Pendentes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'completed', 
      label: 'Concluídas',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={status === filter.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onChange(filter.value)}
          className="flex items-center gap-1 text-xs px-2 sm:px-3 py-1"
        >
          <span className="w-3.5 h-3.5">{filter.icon}</span>
          {filter.label}
        </Button>
      ))}
    </div>
  );
}

