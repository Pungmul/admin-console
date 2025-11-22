import { useAtomValue, useSetAtom } from 'jotai';
import { isAuthenticatedAtom, loginAtom, logoutAtom } from '../atoms/auth';

export const useAuth = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);

  return {
    isAuthenticated,
    login: async (username: string, password: string) => {
      const result = await login({ username, password });
      return result;
    },
    logout,
  };
};

