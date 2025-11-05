import { useState } from 'react';
import { Layout, Modal } from '../components/shared';
import { Button } from '../components/shared/Button';
import { TaskForm, TaskList, TaskFilters } from '../components/tasks';
import { useTasks } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';

export function TasksPage() {
  const { status, changeStatus } = useTaskFilters();
  const {
    tasks,
    loading,
    error,
    create,
    update,
    remove,
    toggleStatus,
    isCreating,
    isUpdating,
  } = useTasks(status);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (data: CreateTaskData | UpdateTaskData) => {
    create(data as CreateTaskData);
    setShowModal(false);
    setEditingTask(null);
  };

  const handleUpdate = (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      update({ id: editingTask.id, data: data as UpdateTaskData });
      setEditingTask(null);
      setShowModal(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowModal(false);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Minhas Tarefas</h1>
              {tasks.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-600">
                  {pendingCount} pendente{pendingCount !== 1 ? 's' : ''} • {completedCount} concluída{completedCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button 
              onClick={handleNewTask}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-1.5"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Tarefa
            </Button>
          </div>
          <TaskFilters status={status} onChange={changeStatus} />
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleStatus}
          onEdit={handleEdit}
          onDelete={remove}
        />

        {/* Modal de Nova/Editar Tarefa */}
        <Modal
          isOpen={showModal}
          onClose={handleCancel}
          title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          size="md"
        >
          <TaskForm
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            initialData={editingTask || undefined}
            isLoading={isCreating || isUpdating}
          />
        </Modal>
      </div>
    </Layout>
  );
}

