import type { LoginResponse } from '../model';

export const refreshToken = async (refreshTokenValue: string): Promise<LoginResponse> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const response = await fetch(`${baseUrl}/api/member/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'refreshToken': refreshTokenValue,
    },
  });

  if (!response.ok) {
    throw new Error('토큰 갱신에 실패했습니다.');
  }

  const data: LoginResponse = await response.json();
  
  if (!data.isSuccess) {
    throw new Error(data.message || '토큰 갱신에 실패했습니다.');
  }

  return data;
};

