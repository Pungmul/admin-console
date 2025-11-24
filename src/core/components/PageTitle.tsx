import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': '대시보드',
  '/users': '가입 유저 목록',
  '/users/sanctions': '유저 제재 관리',
  '/posts/reported': '신고 누적 게시물',
  '/posts': '일반 게시글 조회',
  '/notices': '공지사항',
  '/login': '로그인',
};

const DEFAULT_TITLE = '풍덩 관리자 콘솔';

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = PAGE_TITLES[location.pathname] || '';
    const title = pageName ? `${pageName} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    document.title = title;
  }, [location.pathname]);

  return null;
};

export default PageTitle;

