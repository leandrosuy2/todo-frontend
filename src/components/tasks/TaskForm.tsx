import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Task, CreateTaskData, UpdateTaskData } from '../../types';
import { Button, Input } from '../shared';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel?: () => void;
  initialData?: Task;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, onCancel, initialData, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
      });
    } else {
      setFormData({ title: '', description: '' });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({ title: '', description: '' });
      }
    }
  };

  const handleInputChange = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Título"
        type="text"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        error={errors.title}
        placeholder="Digite o título da tarefa"
        disabled={isLoading}
        autoFocus
      />
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Descrição (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Digite a descrição da tarefa (opcional)"
          disabled={isLoading}
          rows={3}
          className="w-full px-2.5 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onCancel} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          size="sm"
          isLoading={isLoading} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {initialData ? (
            <>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvar
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

