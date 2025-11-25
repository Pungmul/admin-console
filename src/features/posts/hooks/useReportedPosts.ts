import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getHiddenPosts, getBoards } from '../api';
import type { HiddenPost, Board } from '../model';

export const useReportedPosts = (initialPage: number, initialPageSize: number) => {
  const [posts, setPosts] = useState<HiddenPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [boards, setBoards] = useState<Board[]>([]);

  const fetchPosts = async (pageNum: number, size: number) => {
    setLoading(true);
    try {
      const response = await getHiddenPosts(pageNum, size);
      setPosts(response.response.hiddenPosts.list);
      setTotal(response.response.hiddenPosts.pages * size);
      setCurrentPage(response.response.hiddenPosts.pageNum);
      // setPageSize(response.response.hiddenPosts.pageSize);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getBoards();
        setBoards(response.response);
      } catch (error) {
        console.error('게시판 목록을 불러오는데 실패했습니다.', error);
      }
    };
    fetchBoards();
  }, []);

  const getCategoryName = (categoryId: number) => {
    const board = boards.find(b => b.id === categoryId);
    return board?.name || '알 수 없음';
  };

  return {
    posts,
    loading,
    total,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refresh: () => fetchPosts(currentPage, pageSize),
    getCategoryName,
  };
};

