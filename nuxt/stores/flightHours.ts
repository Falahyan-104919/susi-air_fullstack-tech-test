import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import type { SummaryRange, SummaryResponse } from '~/types';

export const useFlightHoursStore = defineStore('flightHours', () => {
  const currentRange = ref<SummaryRange>('1w');
  const summary = ref<SummaryResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function fetchSummary(range?: SummaryRange): Promise<SummaryResponse | null> {
    if (range) {
      currentRange.value = range;
    }

    if (!authStore.token) {
      error.value = 'Not authenticated';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await $fetch<SummaryResponse>(
        `${config.public.apiBase}/flight-hours/summary`,
        {
          params: { range: currentRange.value },
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
      summary.value = res;
      return res;
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.response?._data?.message ||
        'Failed to fetch flight hours summary';
      error.value = Array.isArray(message) ? message.join(', ') : message;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentRange,
    summary,
    isLoading,
    error,
    fetchSummary,
  };
});
