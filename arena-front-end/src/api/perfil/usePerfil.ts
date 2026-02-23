import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface PerfilData {
  username: string;
  type: string;
  nome?: string;
  valorPago?: number;
  turma?: string;
  horario?: string;
}

const fetchPerfil = async () => {
  const { data } = await api.get<{ success: boolean; data: PerfilData }>('/perfil');
  return data;
};

export const usePerfil = () => {
  return useQuery<{ success: boolean; data: PerfilData }>({
    queryKey: ['perfil'],
    queryFn: fetchPerfil,
  });
};