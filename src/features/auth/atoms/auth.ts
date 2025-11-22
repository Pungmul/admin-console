import { atom } from 'jotai';
import { loginAdmin } from '../api';

// 세션 스토리지 헬퍼 함수
const getSessionStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const setSessionStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // 세션 스토리지 저장 실패 시 무시
  }
};

const removeSessionStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // 세션 스토리지 삭제 실패 시 무시
  }
};

// Access Token atom (세션 스토리지)
const accessTokenBaseAtom = atom<string | null>(getSessionStorage('accessToken'));

export const accessTokenAtom = atom(
  (get) => get(accessTokenBaseAtom),
  (_get, set, newValue: string | null) => {
    if (newValue === null) {
      removeSessionStorage('accessToken');
    } else {
      setSessionStorage('accessToken', newValue);
    }
    set(accessTokenBaseAtom, newValue);
  }
);

// 인증 상태 atom (accessTokenAtom을 기반으로 자동 계산)
export const isAuthenticatedAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  return accessToken !== null && accessToken !== undefined;
});

// Refresh Token atom (세션 스토리지)
const refreshTokenBaseAtom = atom<string | null>(getSessionStorage('refreshToken'));

export const refreshTokenAtom = atom(
  (get) => get(refreshTokenBaseAtom),
  (_get, set, newValue: string | null) => {
    if (newValue === null) {
      removeSessionStorage('refreshToken');
    } else {
      setSessionStorage('refreshToken', newValue);
    }
    set(refreshTokenBaseAtom, newValue);
  }
);

// 로그인 함수
export const loginAtom = atom(
  null,
  async (_get, set, { username, password }: { username: string; password: string }) => {
    try {
      const response = await loginAdmin(username, password);
      
      // 토큰을 세션 스토리지에 저장
      set(accessTokenAtom, response.response.accessToken);
      set(refreshTokenAtom, response.response.refreshToken);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.' 
      };
    }
  }
);

// 로그아웃 함수
export const logoutAtom = atom(
  null,
  (_get, set) => {
    // 토큰 제거 (isAuthenticatedAtom은 자동으로 false가 됨)
    set(accessTokenAtom, null);
    set(refreshTokenAtom, null);
  }
);

