import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface Plano {
  id: number;
  nome: string;
  treinos_por_semana: number;
  valor: number;
  ativo: boolean;
  total_alunos: number;
}

interface PlanosResponse {
  success: boolean;
  data: Plano[];
}

export const usePlanos = () => {
  return useQuery({
    queryKey: ['planos'],
    queryFn: async (): Promise<PlanosResponse> => {
      const response = await api.get('/planos');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};