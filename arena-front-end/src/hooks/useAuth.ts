import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  username: string;
  userType: 'admin' | 'teacher' | 'student' | 'finance';
}

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error('Token inválido:', error);
      }
    }
    setLoading(false);
  }, []);

  const hasPermission = (allowedRoles: string[]) => {
    return user ? allowedRoles.includes(user.userType) : false;
  };

  const isAdmin = () => user?.userType === 'admin';
  const isTeacher = () => user?.userType === 'teacher';
  const isStudent = () => user?.userType === 'student';
  const isFinance = () => user?.userType === 'finance';

  return {
    user,
    loading,
    hasPermission,
    isAdmin,
    isTeacher,
    isStudent,
    isFinance
  };
};