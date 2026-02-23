import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface DashboardData {
  totalAlunos: number;
  totalTurmas: number;
  presencasPeriodo: number;
  receitaPeriodo: number;
}

const fetchDashboard = async (dataInicio: string, dataFim: string) => {
  const { data } = await api.get(`/dashboard?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  return data;
};

export const useDashboard = (dataInicio: string, dataFim: string) => {
  return useQuery<{ success: boolean; data: DashboardData }>({
    queryKey: ['dashboard', dataInicio, dataFim],
    queryFn: () => fetchDashboard(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
  });
};