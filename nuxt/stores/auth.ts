import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { PilotProfile, LoginResponse } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('susi_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  const pilot = ref<PilotProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string): Promise<LoginResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await $fetch<LoginResponse>(
        `${config.public.apiBase}/auth/login`,
        {
          method: 'POST',
          body: { username, password },
        },
      );
      token.value = res.accessToken;
      pilot.value = res.pilot;
      return res;
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.response?._data?.message ||
        'Authentication failed. Please check your credentials.';
      error.value = Array.isArray(message) ? message.join(', ') : message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProfile(): Promise<PilotProfile | null> {
    if (!token.value) return null;
    try {
      const res = await $fetch<PilotProfile>(`${config.public.apiBase}/pilot/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      pilot.value = res;
      return res;
    } catch (err: any) {
      // Only force logout on genuine 401 Unauthorized
      const status = err?.statusCode || err?.response?.status;
      if (status === 401) {
        logout();
      }
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
