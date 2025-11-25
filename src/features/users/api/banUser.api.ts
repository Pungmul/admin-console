import { apiClient } from '@/core/api/client';
import type { BanUserRequest, BanUserResponse } from '../model';

export const banUser = async (request: BanUserRequest): Promise<BanUserResponse> => {
  const response = await apiClient('/api/member/ban', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('회원 정지에 실패했습니다.');
  }

  const data: BanUserResponse = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '회원 정지에 실패했습니다.');
  }

  return data;
};

