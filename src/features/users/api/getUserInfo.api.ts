import { apiClient } from '@/core/api/client';
import type { UserInfoResponse } from '../model';

export const getUserInfo = async (username: string): Promise<UserInfoResponse> => {
  const response = await apiClient(`/api/member/users/info?username=${encodeURIComponent(username)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('회원 정보를 불러오는데 실패했습니다.');
  }

  const data: UserInfoResponse = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '회원 정보를 불러오는데 실패했습니다.');
  }

  return data;
};

