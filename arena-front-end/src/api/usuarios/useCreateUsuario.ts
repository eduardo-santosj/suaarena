import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface CreateUsuarioData {
  username: string;
  password: string;
  type: string;
}

const createUsuario = async (data: CreateUsuarioData) => {
  const response = await api.post('/usuarios', data);
  return response.data;
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};