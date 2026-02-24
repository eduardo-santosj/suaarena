'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Calendar, CheckSquare, Home, LogOut, Settings, User, UserCheck, Users, X, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [quadrasExpanded, setQuadrasExpanded] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/quadras')) {
      setQuadrasExpanded(true);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const isQuadrasActive = pathname.startsWith('/quadras');

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-80 bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="relative h-[40px] w-[110px]">
              <Image
                className="object-contain"
                src={'/images/brand.png'}
                alt="Logo suprema"
                fill
                priority
                quality={100}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/inicio') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                }`}
                onClick={() => handleNavigation('/inicio')}
              >
                <Home className="mr-3 h-4 w-4" />
                Início
              </Button>

              {hasPermission(['admin', 'teacher', 'viewer']) && (
                <>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive('/alunos') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                    }`}
                    onClick={() => handleNavigation('/alunos')}
                  >
                    <Users className="mr-3 h-4 w-4" />
                    Alunos
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive('/turmas') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                    }`}
                    onClick={() => handleNavigation('/turmas')}
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    Turmas
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive('/presencas') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                    }`}
                    onClick={() => handleNavigation('/presencas')}
                  >
                    <CheckSquare className="mr-3 h-4 w-4" />
                    Presenças
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive('/gerenciar-checkins') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                    }`}
                    onClick={() => handleNavigation('/gerenciar-checkins')}
                  >
                    <UserCheck className="mr-3 h-4 w-4" />
                    Checkins
                  </Button>
                </>
              )}

              {hasPermission(['admin', 'viewer']) && (
                <>
                  <div>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isQuadrasActive ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                      }`}
                      onClick={() => setQuadrasExpanded(!quadrasExpanded)}
                    >
                      <MapPin className="mr-3 h-4 w-4" />
                      Quadras
                      {quadrasExpanded ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                    {quadrasExpanded && (
                      <div className="ml-6 space-y-1 mt-1">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm ${
                            isActive('/quadras') ? 'bg-newyellow/20 text-newyellow hover:bg-newyellow/30' : ''
                          }`}
                          onClick={() => handleNavigation('/quadras')}
                        >
                          Gerenciar Quadras
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm ${
                            isActive('/quadras/calendario') ? 'bg-newyellow/20 text-newyellow hover:bg-newyellow/30' : ''
                          }`}
                          onClick={() => handleNavigation('/quadras/calendario')}
                        >
                          Calendário
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive('/usuarios') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                    }`}
                    onClick={() => handleNavigation('/usuarios')}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Usuários
                  </Button>
                </>
              )}

              {hasPermission(['student']) && (
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive('/checkin') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                  }`}
                  onClick={() => handleNavigation('/checkin')}
                >
                  <UserCheck className="mr-3 h-4 w-4" />
                  Check-in
                </Button>
              )}

              {hasPermission(['admin', 'finance', 'viewer']) && (
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive('/dashboard') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
                  }`}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Dashboard
                </Button>
              )}
            </div>
          </nav>

          <div className="p-4 border-t space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive('/meu-perfil') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
              }`}
              onClick={() => handleNavigation('/meu-perfil')}
            >
              <User className="mr-3 h-4 w-4" />
              Meu Perfil
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive('/alterar-senha') ? 'bg-newyellow text-black hover:bg-newyellow-hover hover:text-white' : ''
              }`}
              onClick={() => handleNavigation('/alterar-senha')}
            >
              <Settings className="mr-3 h-4 w-4" />
              Alterar Senha
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};