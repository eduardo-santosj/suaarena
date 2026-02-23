import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface Quadra {
  id: number;
  nome: string;
  descricao: string;
  ativa: boolean;
  total_reservas: number;
}

interface QuadrasResponse {
  success: boolean;
  data: Quadra[];
}

export const useQuadras = () => {
  return useQuery({
    queryKey: ['quadras'],
    queryFn: async (): Promise<QuadrasResponse> => {
      const response = await api.get('/quadras');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};