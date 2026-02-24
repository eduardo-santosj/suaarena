import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userType: 'admin' | 'teacher' | 'student' | 'finance' | 'viewer' | 'pending';
  primeiroAcesso?: boolean;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isAcessoPendentePage = request.nextUrl.pathname.startsWith('/acesso-pendente');
  const pathname = request.nextUrl.pathname;
  
  // Se não tem token e não está na página de login, redireciona
  if (!token && !isLoginPage && !isAcessoPendentePage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se tem token e está na página de login, redireciona baseado no perfil
  if (token && isLoginPage) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.userType === 'pending') {
        return NextResponse.redirect(new URL('/acesso-pendente', request.url));
      }
      if (decoded.primeiroAcesso) {
        return NextResponse.redirect(new URL('/trocar-senha', request.url));
      }
      const redirectPath = decoded.userType === 'student' ? '/checkin' : '/alunos';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch {
      return NextResponse.redirect(new URL('/alunos', request.url));
    }
  }
  
  // Verificação de acesso por perfil
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userType = decoded.userType;
      
      // Se for pending, só pode acessar acesso-pendente
      if (userType === 'pending' && !isAcessoPendentePage) {
        return NextResponse.redirect(new URL('/acesso-pendente', request.url));
      }
      
      // Se não for pending e tentar acessar acesso-pendente, redireciona
      if (userType !== 'pending' && isAcessoPendentePage) {
        const redirectPath = userType === 'student' ? '/checkin' : '/alunos';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      
      // Redirecionar para troca de senha se for primeiro acesso
      if (decoded.primeiroAcesso && !pathname.startsWith('/trocar-senha')) {
        return NextResponse.redirect(new URL('/trocar-senha', request.url));
      }
      
      // Bloqueios por rota (viewer tem acesso a tudo)
      if (pathname.startsWith('/alunos') && !['admin', 'teacher', 'viewer'].includes(userType)) {
        return NextResponse.redirect(new URL('/checkin', request.url));
      }
      
      if (pathname.startsWith('/turmas') && !['admin', 'teacher', 'student', 'viewer'].includes(userType)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      if (pathname.startsWith('/presencas') && !['admin', 'teacher', 'viewer'].includes(userType)) {
        return NextResponse.redirect(new URL('/checkin', request.url));
      }
      
      if (pathname.startsWith('/checkin') && userType !== 'student') {
        return NextResponse.redirect(new URL('/alunos', request.url));
      }
      
      if (pathname.startsWith('/dashboard') && !['admin', 'finance', 'viewer'].includes(userType)) {
        const redirectPath = userType === 'student' ? '/checkin' : '/alunos';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    } catch {
      // Token inválido, redireciona para login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|api/public|images|unavailable|acesso-pendente).*)',
  ],
}