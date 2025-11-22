import type { LoginResponse } from '../model';

export const loginAdmin = async (loginId: string, password: string): Promise<LoginResponse> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const response = await fetch(`${baseUrl}/api/member/login/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginId, password }),
  });

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다.');
  }

  const data: LoginResponse = await response.json();
  
  if (!data.isSuccess) {
    throw new Error(data.message || '로그인에 실패했습니다.');
  }

  return data;
};

