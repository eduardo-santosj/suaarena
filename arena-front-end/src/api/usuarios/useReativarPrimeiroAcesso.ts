import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const reativarPrimeiroAcesso = async (id: number) => {
  const response = await api.put(`/usuarios/${id}/reativar-primeiro-acesso`);
  return response.data;
};

export const useReativarPrimeiroAcesso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reativarPrimeiroAcesso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};