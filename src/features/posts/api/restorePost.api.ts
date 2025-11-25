import { apiClient } from '@/core/api/client';

export const restorePost = async (postId: number): Promise<void> => {
  const response = await apiClient(`/api/posts/${postId}/unhide`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('게시글 복구에 실패했습니다.');
  }

  const data = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '게시글 복구에 실패했습니다.');
  }
};

