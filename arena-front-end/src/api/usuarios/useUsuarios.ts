import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

interface Usuario {
  id: number;
  username: string;
  type: string;
}

interface UsuariosResponse {
  success: boolean;
  data: Usuario[];
}

const fetchUsuarios = async () => {
  const { data } = await api.get<UsuariosResponse>('/usuarios');
  return data;
};

export const useUsuarios = () => {
  return useQuery<UsuariosResponse>({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  });
};