import { apiClient } from '@/core/api/client';
import type { HiddenPostsResponse } from '../model';

export const getHiddenPosts = async (
  page: number = 1,
  size: number = 20
): Promise<HiddenPostsResponse> => {
  const response = await apiClient(`/api/posts/hidden?page=${page}&size=${size}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('게시글 목록을 불러오는데 실패했습니다.');
  }

  const data: HiddenPostsResponse = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '게시글 목록을 불러오는데 실패했습니다.');
  }

  return data;
};

