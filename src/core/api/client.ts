import { accessTokenAtom, refreshTokenAtom } from '@/features/auth/atoms/auth';
import { refreshToken as refreshTokenAPI } from '@/features/auth/api';
import { getDefaultStore } from 'jotai';
import { Modal } from 'antd';

const store = getDefaultStore();

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  const currentRefreshToken = store.get(refreshTokenAtom);
  
  if (!currentRefreshToken) {
    throw new Error('Refresh token이 없습니다.');
  }

  try {
    const response = await refreshTokenAPI(currentRefreshToken);
    
    // 새 토큰 저장
    store.set(accessTokenAtom, response.response.accessToken);
    store.set(refreshTokenAtom, response.response.refreshToken);
    
    return response.response.accessToken;
  } catch (error) {
    // 토큰 갱신 실패 시 로그아웃 처리 (isAuthenticatedAtom은 자동으로 false가 됨)
    store.set(accessTokenAtom, null);
    store.set(refreshTokenAtom, null);
    throw error;
  }
};

// API 요청 헬퍼 함수
export const apiClient = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // 현재 accessToken 가져오기
  let accessToken = store.get(accessTokenAtom);
  
  // 기본 헤더 설정
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // 첫 번째 요청 시도
  let response = await fetch(fullUrl, {
    ...options,
    headers,
  });
  
  // 401 에러이고 refreshToken이 있으면 토큰 갱신 후 재시도
  if ((response.status === 401 || response.status === 403 )&& store.get(refreshTokenAtom)) {
    try {
      accessToken = await refreshAccessToken();
      
      // 새 토큰으로 재요청
      headers.set('Authorization', `Bearer ${accessToken}`);
      response = await fetch(fullUrl, {
        ...options,
        headers,
      });
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃 처리 (isAuthenticatedAtom은 자동으로 false가 됨)
      store.set(accessTokenAtom, null);
      store.set(refreshTokenAtom, null);
      
      // 세션 만료 알림 및 로그인 페이지로 리디렉션
      if (typeof window !== 'undefined') {
        Modal.warning({
          title: '세션 만료',
          content: '세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.',
          okText: '확인',
          onOk: () => {
            window.location.href = '/login';
          },
          transitionName: '',
          maskTransitionName: '',
        });
      }
      throw error;
    }
  }
  
  return response;
};

