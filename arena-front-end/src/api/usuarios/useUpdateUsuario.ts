import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface UpdateUsuarioData {
  username?: string;
  password?: string;
  type?: string;
}

const updateUsuario = async ({ id, data }: { id: number; data: UpdateUsuarioData }) => {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};