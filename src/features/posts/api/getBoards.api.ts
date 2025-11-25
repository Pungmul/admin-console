import type { BoardsResponse } from '../model';
import { apiClient } from '@/core/api/client';

export const getBoards = async (): Promise<BoardsResponse> => {
  const response = await apiClient(`/api/boards`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('게시판 목록을 불러오는데 실패했습니다.');
  }

  const data: BoardsResponse = await response.json();

  if (!data.isSuccess) {
    throw new Error(data.message || '게시판 목록을 불러오는데 실패했습니다.');
  }

  return data;
};

