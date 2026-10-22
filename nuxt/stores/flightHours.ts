import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiClient, ApiError } from '~/composables/useApiClient';
import type { SummaryRange, SummaryResponse } from '~/types';

export const useFlightHoursStore = defineStore('flightHours', () => {
  const currentRange = ref<SummaryRange>('1w');
  const summary = ref<SummaryResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = useApiClient();

  async function fetchSummary(range?: SummaryRange): Promise<SummaryResponse | null> {
    if (range) {
      currentRange.value = range;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await api.get<SummaryResponse>('/flight-hours/summary', {
        params: { range: currentRange.value },
      });
      summary.value = res;
      return res;
    } catch (err: any) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch flight hours summary';
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
