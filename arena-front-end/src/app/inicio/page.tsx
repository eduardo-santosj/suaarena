'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, CheckSquare, UserCheck, BarChart3, Settings, MapPin } from 'lucide-react';

export default function InicioPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  const menuItems = [
    ...(hasPermission(['admin', 'teacher']) ? [
      {
        title: 'Alunos',
        description: 'Gerenciar cadastro de alunos',
        icon: Users,
        path: '/alunos',
        color: 'bg-blue-500'
      },
      {
        title: 'Turmas',
        description: 'Criar e gerenciar turmas',
        icon: Calendar,
        path: '/turmas',
        color: 'bg-green-500'
      },
      {
        title: 'Presenças',
        description: 'Controlar presenças dos alunos',
        icon: CheckSquare,
        path: '/presencas',
        color: 'bg-purple-500'
      },
      {
        title: 'Checkins',
        description: 'Gerenciar check-ins dos alunos',
        icon: UserCheck,
        path: '/gerenciar-checkins',
        color: 'bg-orange-500'
      }
    ] : []),
    
    ...(hasPermission(['admin']) ? [
      {
        title: 'Quadras',
        description: 'Gerenciar quadras e reservas',
        icon: MapPin,
        path: '/quadras',
        color: 'bg-emerald-500'
      },
      {
        title: 'Usuários',
        description: 'Gerenciar usuários do sistema',
        icon: Settings,
        path: '/usuarios',
        color: 'bg-red-500'
      }
    ] : []),
    
    ...(hasPermission(['student']) ? [
      {
        title: 'Check-in',
        description: 'Fazer check-in nas aulas',
        icon: UserCheck,
        path: '/checkin',
        color: 'bg-green-500'
      }
    ] : []),
    
    ...(hasPermission(['admin', 'finance']) ? [
      {
        title: 'Dashboard',
        description: 'Visualizar relatórios e estatísticas',
        icon: BarChart3,
        path: '/dashboard',
        color: 'bg-indigo-500'
      }
    ] : [])
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao SuaArena</h1>
        <p className="text-muted-foreground">
          Escolha uma das opções abaixo para começar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {item.description}
                </CardDescription>
                <Button 
                  onClick={() => router.push(item.path)}
                  className="w-full"
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}