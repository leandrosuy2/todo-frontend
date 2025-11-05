import type { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { Spinner, Alert } from '../shared';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskList({ tasks, loading, error, onToggle, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 sm:py-16">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Carregando tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Erro ao carregar tarefas: {error.message}</span>
        </div>
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mb-4">
          Crie uma nova tarefa para começar
        </p>
        <p className="text-xs text-gray-400">
          Clique no botão "Nova Tarefa" acima
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

