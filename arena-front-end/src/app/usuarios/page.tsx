'use client';

import { useCreateUsuario } from '@/api/usuarios/useCreateUsuario';
import { useDeleteUsuario } from '@/api/usuarios/useDeleteUsuario';
import { useReativarPrimeiroAcesso } from '@/api/usuarios/useReativarPrimeiroAcesso';
import { useUpdateUsuario } from '@/api/usuarios/useUpdateUsuario';
import { useUsuarios } from '@/api/usuarios/useUsuarios';
import { DataTable } from '@/components/dataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/hooks/useAuth';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, PlusCircle, RotateCcw, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface Usuario {
  id: number;
  username: string;
  type: string;
}

export default function UsuariosPage() {
  const { isAdmin } = useAuth();
  const alert = useAlert();
  const { data: usuariosData, isLoading } = useUsuarios();
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();
  const reativarAcesso = useReativarPrimeiroAcesso();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: ''
  });

  const usuarios = usuariosData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.type) {
      alert.show('error', 'Username e tipo são obrigatórios');
      return;
    }

    if (!editingUser && !formData.password) {
      alert.show('error', 'Senha é obrigatória para novos usuários');
      return;
    }

    try {
      if (editingUser) {
        const updateData: { username: string; type: string; password?: string } = { username: formData.username, type: formData.type };
        if (formData.password) updateData.password = formData.password;
        
        await updateUsuario.mutateAsync({ id: editingUser.id, data: updateData });
        alert.show('success', 'Usuário atualizado!');
      } else {
        await createUsuario.mutateAsync({
          username: formData.username,
          password: formData.password,
          type: formData.type
        });
        alert.show('success', 'Usuário criado!');
      }
      
      setFormData({ username: '', password: '', type: '' });
      setEditingUser(null);
      setModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erro ao salvar usuário';
      alert.show('error', errorMessage || 'Erro ao salvar usuário');
    }
  };

  const handleReativarPrimeiroAcesso = useCallback(async (id: number) => {
    if (!confirm('Reativar primeiro acesso? A senha será resetada para "admin123".')) return;
    
    try {
      const result = await reativarAcesso.mutateAsync(id);
      alert.show('success', result.message);
    } catch {
      alert.show('error', 'Erro ao reativar primeiro acesso');
    }
  }, [reativarAcesso, alert]);

  const handleDeleteUsuario = useCallback(async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    try {
      await deleteUsuario.mutateAsync(id);
      alert.show('success', 'Usuário deletado!');
    } catch {
      alert.show('error', 'Erro ao deletar usuário');
    }
  }, [deleteUsuario, alert]);

  const openModal = useCallback((user?: Usuario) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, password: '', type: user.type });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', type: '' });
    }
    setModalOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Usuario>[]>(
    () => {
      const getTipoBadge = (type: string) => {
        const colors = {
          admin: 'destructive',
          teacher: 'default',
          finance: 'secondary',
          student: 'outline'
        };
        return colors[type as keyof typeof colors] || 'outline';
      };
      
      return [
      {
        accessorKey: 'username',
        header: 'Usuário',
        cell: ({ getValue }) => (
          <span className="font-medium text-sm">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ getValue }) => {
          const type = getValue<string>();
          return (
            <Badge variant={getTipoBadge(type) as 'destructive' | 'default' | 'secondary' | 'outline'}>
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal(row.original)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReativarPrimeiroAcesso(row.original.id)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteUsuario(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
      ];
    },
    [handleDeleteUsuario, handleReativarPrimeiroAcesso, openModal],
  );

  if (!isAdmin()) {
    return <div>Acesso negado. Apenas administradores podem acessar esta página.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Gerenciar Usuários</h1>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => openModal()}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Digite o nome de usuário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha {editingUser && '(deixe vazio para não alterar)'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite a senha"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Usuário</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="finance">Financeiro</SelectItem>
                    <SelectItem value="student">Estudante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" disabled={createUsuario.isPending || updateUsuario.isPending} className="w-full">
                {(createUsuario.isPending || updateUsuario.isPending) ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <DataTable
        columns={columns}
        data={usuarios}
        isLoadingData={isLoading}
        isErrorData={false}
        isLenghtNill={usuarios.length === 0}
        errorMessage="Nenhum usuário encontrado"
        minLengthSkeleton={5}
      />
    </div>
  );
}