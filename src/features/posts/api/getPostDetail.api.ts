import { apiClient } from '@/core/api/client';
import type { PostDetailResponse } from '../model';

export const getPostDetail = async (postId: number): Promise<PostDetailResponse> => {
  const response = await apiClient(`/api/posts/${postId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  const data: PostDetailResponse = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '게시글을 불러오는데 실패했습니다.');
  }

  return data;
};

