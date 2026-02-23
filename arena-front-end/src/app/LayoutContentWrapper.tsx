'use client';

import { usePathname } from 'next/navigation';

import { LayoutContent } from '@/components/LayoutContent';

export function LayoutContentWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  // Adapte para outras rotas públicas se necessário
  const isLogin = pathname === '/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return <LayoutContent>{children}</LayoutContent>;
}
