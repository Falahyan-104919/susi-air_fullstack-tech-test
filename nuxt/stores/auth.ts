import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useApiClient, ApiError } from '~/composables/useApiClient';
import type { PilotProfile, LoginResponse } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('susi_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  const pilot = ref<PilotProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = useApiClient();

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string): Promise<LoginResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.post<LoginResponse>(
        '/auth/login',
        { username, password },
        { requiresAuth: false },
      );
      token.value = res.accessToken;
      pilot.value = res.pilot;
      return res;
    } catch (err: any) {
      error.value = err instanceof ApiError ? err.message : 'Authentication failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProfile(): Promise<PilotProfile | null> {
    if (!token.value) return null;
    try {
      const res = await api.get<PilotProfile>('/pilot/me');
      pilot.value = res;
      return res;
    } catch {
      return null;
    }
  }

  function logout() {
    token.value = null;
    pilot.value = null;
    navigateTo('/login');
  }

  return {
    token,
    pilot,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchProfile,
    logout,
  };
});
