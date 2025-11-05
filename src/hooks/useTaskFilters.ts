import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TaskStatus } from '../types';

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<TaskStatus>(() => {
    const statusParam = searchParams.get('status') as TaskStatus;
    return statusParam && ['all', 'pending', 'completed'].includes(statusParam)
      ? statusParam
      : 'all';
  });

  useEffect(() => {
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams, { replace: true });
  }, [status, searchParams, setSearchParams]);

  const changeStatus = (newStatus: TaskStatus) => {
    setStatus(newStatus);
  };

  return {
    status,
    changeStatus,
  };
}

