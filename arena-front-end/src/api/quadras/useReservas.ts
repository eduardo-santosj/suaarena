import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface Reserva {
  id: number;
  quadra_id: number;
  quadra_nome: string;
  data_reserva: string;
  hora_inicio: string;
  hora_fim: string;
  descricao: string;
  valor: number;
  tipo_recorrencia: 'unica' | 'diaria' | 'semanal';
  dias_semana: number[];
  usuario_nome: string;
}

interface ReservasResponse {
  success: boolean;
  data: Reserva[];
}

interface UseReservasParams {
  data_inicio: string;
  data_fim: string;
}

export const useReservas = ({ data_inicio, data_fim }: UseReservasParams) => {
  return useQuery({
    queryKey: ['reservas', data_inicio, data_fim],
    queryFn: async (): Promise<ReservasResponse> => {
      const response = await api.get('/quadras/reservas', {
        params: { data_inicio, data_fim }
      });
      return response.data;
    },
    enabled: !!data_inicio && !!data_fim,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};