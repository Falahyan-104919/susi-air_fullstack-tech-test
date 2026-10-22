import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import type { LegendItem, ScheduleEntry, SchedulesResponse } from '~/types';

export const useScheduleStore = defineStore('schedule', () => {
  const year = ref<string>('2026');
  const month = ref<string>('05');
  const entries = ref<ScheduleEntry[]>([]);
  const legend = ref<LegendItem[]>([]);
  const today = ref<string>('2026-05-15');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function fetchSchedules(targetYear?: string, targetMonth?: string): Promise<ScheduleEntry[]> {
    if (targetYear) year.value = targetYear;
    if (targetMonth) month.value = targetMonth.padStart(2, '0');

    if (!authStore.token) {
      error.value = 'Not authenticated';
      return [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await $fetch<SchedulesResponse>(
        `${config.public.apiBase}/schedules`,
        {
          params: {
            year: year.value,
            month: month.value,
          },
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
      entries.value = res.entries;
      legend.value = res.legend;
      today.value = res.today;
      return res.entries;
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.response?._data?.message ||
        'Failed to fetch duty schedules';
      error.value = Array.isArray(message) ? message.join(', ') : message;
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  function setMonth(newYear: number, newMonth: number) {
    year.value = newYear.toString();
    month.value = newMonth.toString().padStart(2, '0');
    return fetchSchedules();
  }

  function nextMonth() {
    let y = parseInt(year.value, 10);
    let m = parseInt(month.value, 10) + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    return setMonth(y, m);
  }

  function prevMonth() {
    let y = parseInt(year.value, 10);
    let m = parseInt(month.value, 10) - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    return setMonth(y, m);
  }

  return {
    year,
    month,
    entries,
    legend,
    today,
    isLoading,
    error,
    fetchSchedules,
    setMonth,
    nextMonth,
    prevMonth,
  };
});
