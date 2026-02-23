import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const deleteUsuario = async (id: number) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};