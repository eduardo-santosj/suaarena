export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `accessToken=${accessToken}; path=/; max-age=86400`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`;
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }

  clearTokens();
  return null;
};