import { useState } from 'react';
import type { Task } from '../../types';
import { Button, Checkbox, Card, Modal } from '../shared';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    onDelete(task.id);
    setShowConfirmModal(false);
    setTimeout(() => {
      setIsDeleting(false);
    }, 500);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const isCompleted = task.status === 'completed';

  return (
    <Card className={`transition-all duration-200 ${isDeleting ? 'opacity-50' : ''} ${isCompleted ? 'bg-gray-50' : 'bg-white'} hover:shadow-md`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox */}
        <div className="pt-0.5 flex-shrink-0">
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggle(task.id)}
            aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm sm:text-base font-medium ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-xs sm:text-sm ${
                isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-0.5 text-green-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Concluída
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={isDeleting}
            className="text-xs px-1.5 sm:px-2 py-1"
            title="Editar tarefa"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-xs px-1.5 sm:px-2 py-1"
            title="Excluir tarefa"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-700 mb-1">
                Tem certeza que deseja excluir esta tarefa?
              </p>
              <p className="text-xs text-gray-500 font-medium">
                "{task.title}"
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

