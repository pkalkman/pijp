import { authClient } from '~~/lib/auth-client';
import type { InferSessionFromClient, InferUserFromClient } from 'better-auth/client';

export const useAuth = () => {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const session = useState<InferSessionFromClient<any> | null>('auth:session', () => null);
  const user = useState<InferUserFromClient<any> | null>('auth:user', () => null);

  const isAuthLoading = useState<boolean>('auth:loading', () => true);
  const isAuthenticated = computed(() => !!user.value);

  const loginMetEmail = async (email: string, password: string) => {
    try {
      const { data } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (data) {
        user.value = data.user;
      }

      return { success: true, message: 'Ingelogd' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.data?.message || error.message || 'Er is een fout opgetreden bij het inloggen',
      };
    }
  };

  const logout = async () => {
    try {
      const res = await authClient.signOut();
      session.value = null;
      user.value = null;
      await navigateTo('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear user state anyway
      user.value = null;
      return { success: false, message: 'Fout bij uitloggen' };
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const { data } = await authClient.getSession({
        fetchOptions: {
          headers,
        },
      });
      session.value = data?.session || null;
      user.value = data?.user || null;
    } catch (error: any) {
      // 401 is verwacht gedrag voor niet-ingelogde gebruikers, niet loggen
      if (error?.status !== 401 && error?.statusCode !== 401) {
        console.error('Fetch current user error:', error);
      }
      user.value = null;
      throw error;
    }
  };

  const checkAuth = async () => {
    isAuthLoading.value = true;
    try {
      await fetchCurrentUser();
      return true;
    } catch (error) {
      user.value = null;
      return false;
    } finally {
      isAuthLoading.value = false;
    }
  };

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isAuthLoading: readonly(isAuthLoading),

    // Methods
    loginMetEmail,
    logout,
    fetchCurrentUser,
    checkAuth,
  };
};
