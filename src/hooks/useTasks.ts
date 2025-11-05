import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '../types';
import { toast } from 'react-hot-toast';

export function useTasks(status: TaskStatus = 'all', page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', status, page, limit],
    queryFn: async () => {
      const response = await apiClient.getTasks({ 
        status: status === 'all' ? undefined : status, 
        page, 
        limit 
      });
      return response;
    },
  });

  const tasks = data?.tasks || [];
  const pagination = data?.pagination || null;

  const createMutation = useMutation({
    mutationFn: (taskData: CreateTaskData) => apiClient.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar tarefa';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) =>
      apiClient.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar tarefa';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao excluir tarefa';
      toast.error(message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiClient.toggleTaskStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao alternar status da tarefa';
      toast.error(message);
    },
  });

  return {
    tasks: tasks as Task[],
    pagination,
    loading: isLoading,
    error,
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    toggleStatus: toggleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}
